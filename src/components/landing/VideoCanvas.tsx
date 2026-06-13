import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 241;

// Lerp factor — lower = smoother/lazier, higher = snappier
// 0.10 feels cinematic without feeling stuck
const LERP = 0.10;

// LRU Image Cache to limit active GPU texture memory
// This prevents mobile Out-Of-Memory (OOM) crashes by keeping at most 24 decoded frames in JS/GPU memory,
// while relying on the browser's native HTTP cache (Netlify CDN) for instant, lossless 0ms loading.
class ImageLRUCache {
  private cache = new Map<number, HTMLImageElement>();
  private maxCacheSize = 24;

  public get(idx: number): HTMLImageElement {
    if (this.cache.has(idx)) {
      const img = this.cache.get(idx)!;
      // Refresh key order (LRU)
      this.cache.delete(idx);
      this.cache.set(idx, img);
      return img;
    }

    const img = new Image();
    img.src = `/frames/frame_${String(idx).padStart(3, "0")}.webp`;
    this.cache.set(idx, img);

    // Evict least recently used image to free memory
    if (this.cache.size > this.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    return img;
  }

  // Pre-fill cache for a specific frame if needed
  public set(idx: number, img: HTMLImageElement) {
    this.cache.set(idx, img);
  }
}

export function VideoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageCacheRef = useRef<ImageLRUCache>(new ImageLRUCache());
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // SSR & Mobile detection guard
  useEffect(() => {
    setIsMounted(true);
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsReady(true); // Hide loading screen instantly on mobile
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Preload WebP frames: Instant First Frame + Progressive CDN Cache Pre-filling ──
  useEffect(() => {
    if (!isMounted || isMobile) return; // Completely disable preloading on mobile devices to save bandwidth/memory
    let active = true;
    let loaded = 0;

    // 1. Load the first frame immediately so the site is instantly interactive
    const firstImg = new Image();
    firstImg.src = `/frames/frame_000.webp`;
    imageCacheRef.current.set(0, firstImg);

    const onFirstFrameLoaded = () => {
      if (!active) return;
      loaded = 1;
      setLoadedCount(1);
      setIsReady(true);

      // 2. Preload remaining frames in batches of 6 so they are cached in the browser's HTTP cache (from Netlify CDN)
      const loadRemaining = async () => {
        const batchSize = 6;
        for (let i = 1; i < TOTAL_FRAMES; i += batchSize) {
          if (!active) return;
          const batch = [];

          for (let j = 0; j < batchSize && i + j < TOTAL_FRAMES; j++) {
            const idx = i + j;
            if (idx === 0) continue;

            const promise = new Promise<void>((resolve) => {
              const img = new Image();
              const done = () => {
                loaded++;
                setLoadedCount(loaded);
                resolve();
              };

              img.src = `/frames/frame_${String(idx).padStart(3, "0")}.webp`;
              if (img.complete && img.naturalWidth > 0) {
                done();
              } else {
                img.decode()
                  .then(done)
                  .catch(done);
              }
            });

            batch.push(promise);
          }

          await Promise.all(batch);
        }
      };

      setTimeout(() => {
        if (active) {
          loadRemaining();
        }
      }, 150);
    };

    if (firstImg.complete && firstImg.naturalWidth > 0) {
      onFirstFrameLoaded();
    } else {
      firstImg.decode()
        .then(onFirstFrameLoaded)
        .catch(onFirstFrameLoaded);
    }

    return () => {
      active = false;
    };
  }, [isMounted, isMobile]);

  // ── Smooth RAF animation loop ─────────────────────────────────────────────
  useEffect(() => {
    if (!isReady || isMobile) return; // Completely disable RAF animation loop on mobile
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // High-quality upscaling on the GPU
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    let currentFrame = 0;
    let targetFrame  = 0;
    let rafId: number;
    let logicalW = window.innerWidth;
    let logicalH = window.innerHeight;

    const getTargetFrame = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress  = maxScroll <= 0 ? 0 : Math.min(1, scrollTop / maxScroll);
      return progress * (TOTAL_FRAMES - 1);
    };

    const renderFrame = (idx: number) => {
      const targetIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(idx)));
      const img = imageCacheRef.current.get(targetIdx);
      if (!img || img.naturalWidth === 0) return;

      // Draw using physical resolution of the canvas directly (bypassing subpixel transform blur)
      const cw = canvas.width;
      const ch = canvas.height;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;

      let dw = cw, dh = ch, dx = 0, dy = 0;
      if (cr > ir) { dh = cw / ir; dy = (ch - dh) / 2; }
      else         { dw = ch * ir; dx = (cw - dw) / 2; }

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 3); // support up to 3x Retina/UHD screens
      logicalW = window.innerWidth;
      logicalH = window.innerHeight;
      // Physical pixels resolution
      canvas.width  = logicalW * dpr;
      canvas.height = logicalH * dpr;
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      renderFrame(currentFrame);
    };

    // RAF loop — smoothly lerps currentFrame toward targetFrame
    const tick = () => {
      targetFrame = getTargetFrame();
      const diff  = targetFrame - currentFrame;

      if (Math.abs(diff) > 0.05) {
        currentFrame += diff * LERP;
        renderFrame(currentFrame);
      }

      rafId = requestAnimationFrame(tick);
    };

    resize();
    renderFrame(0);
    rafId = requestAnimationFrame(tick);

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [isReady, isMobile]);

  if (!isMounted) return null;

  // Solid black background for mobile viewports
  if (isMobile) {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        background: "#080808",
      }} />
    );
  }

  const pct = Math.min(100, Math.round((loadedCount / TOTAL_FRAMES) * 100));

  return (
    <>
      {/* ── Loading screen ─────────────────────────────────────── */}
      {!isReady && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "#080808",
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, width: 260 }}>
            {/* Logo placeholder while loading */}
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 8,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "rgba(255,255,255,0.4)",
                animation: "pulse 1.6s ease-in-out infinite",
              }} />
            </div>
            <span style={{
              fontSize: 9, letterSpacing: "0.3em",
              textTransform: "uppercase", color: "#444",
              fontFamily: "system-ui, sans-serif",
            }}>
              Arroww Productions
            </span>
            {/* Progress track */}
            <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${pct}%`,
                background: "rgba(255,255,255,0.7)",
                transition: "width 0.3s ease-out",
              }} />
            </div>
            <span style={{ fontFamily: "monospace", fontSize: 10, color: "#3a3a3a" }}>
              {pct}%
            </span>
          </div>
        </div>
      )}

      {/* ── Fixed HiDPI canvas background ──────────────────────── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        pointerEvents: "none", overflow: "hidden",
        transform: "translate3d(0, 0, 0)",
        WebkitTransform: "translate3d(0, 0, 0)",
        WebkitBackfaceVisibility: "hidden",
        willChange: "transform",
      }}>
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width: "100vw",
            height: "100vh",
            imageRendering: "auto",
            filter: "contrast(1.06) brightness(1.03) saturate(1.03)",
            transform: "translate3d(0, 0, 0)",
            WebkitTransform: "translate3d(0, 0, 0)",
            WebkitBackfaceVisibility: "hidden",
            willChange: "transform",
          }}
        />
        {/* Cinematic gradient — darker at top/bottom and subtle center dark overlay for text legibility */}
        <div style={{
          position: "absolute", inset: 0,
          background: [
            "linear-gradient(to bottom,",
            "  rgba(8,8,8,0.72)  0%,",
            "  rgba(8,8,8,0.48) 35%,",
            "  rgba(8,8,8,0.48) 65%,",
            "  rgba(8,8,8,0.78) 100%)",
          ].join(" "),
        }} />
      </div>

      {/* Keyframe for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50%       { opacity: 0.9; transform: scale(1.15); }
        }
      `}</style>
    </>
  );
}
