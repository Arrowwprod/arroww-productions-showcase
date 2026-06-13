import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 241;

// Lerp factor — lower = smoother/lazier, higher = snappier
// 0.10 feels cinematic without feeling stuck
const LERP = 0.10;

export function VideoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // SSR & Mobile detection guard
  useEffect(() => {
    setIsMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Preload WebP frames: Instant First Frame + Progressive Batch Loading ──
  useEffect(() => {
    if (!isMounted) return;
    let active = true;
    let loaded = 0;
    const isMobileDevice = window.innerWidth < 768;
    const step = isMobileDevice ? 3 : 1; // Downsample 3x on mobile to save memory and prevent OOM crash
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    // 1. Load the first frame immediately so the site is instantly interactive
    const firstImg = new Image();
    firstImg.src = `/frames/frame_000.webp`;
    images[0] = firstImg;

    const onFirstFrameLoaded = () => {
      if (!active) return;
      loaded = 1;
      setLoadedCount(1);
      setIsReady(true);

      // 2. Load the remaining frames in sequential batches to prevent network & GPU congestion
      const loadRemaining = async () => {
        const batchSize = isMobileDevice ? 4 : 6;
        for (let i = step; i < TOTAL_FRAMES; i += step * batchSize) {
          if (!active) return;
          const batch = [];

          for (let j = 0; j < batchSize && i + j * step < TOTAL_FRAMES; j++) {
            const idx = i + j * step;
            if (idx === 0) continue; // Skip first frame (already loaded)
            
            const img = new Image();
            images[idx] = img;

            const promise = new Promise<void>((resolve) => {
              const done = () => {
                if (!active) {
                  resolve();
                  return;
                }
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

          // Wait for the current batch to be downloaded and decoded before requesting the next one
          await Promise.all(batch);
        }

        // Always load the very last frame to guarantee the ending visual is correct
        const lastIdx = TOTAL_FRAMES - 1;
        if (!images[lastIdx] && active) {
          const img = new Image();
          images[lastIdx] = img;
          img.src = `/frames/frame_${String(lastIdx).padStart(3, "0")}.webp`;
          img.decode().then(() => {
            if (active) {
              loaded++;
              setLoadedCount(loaded);
            }
          }).catch(() => {});
        }
      };

      // Defer the background load slightly to give priority to other initial assets (styles, fonts, etc.)
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

    imagesRef.current = images;
    return () => {
      active = false;
    };
  }, [isMounted]);

  // ── Smooth RAF animation loop ─────────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return;
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
      let img = imagesRef.current[targetIdx];
      
      // Nearest loaded frame fallback logic
      if (!img || img.naturalWidth === 0) {
        let nearestIdx = -1;
        let minDiff = Infinity;
        for (let k = 0; k < TOTAL_FRAMES; k++) {
          const checkImg = imagesRef.current[k];
          if (checkImg && checkImg.naturalWidth > 0) {
            const diff = Math.abs(k - targetIdx);
            if (diff < minDiff) {
              minDiff = diff;
              nearestIdx = k;
            }
          }
        }
        if (nearestIdx !== -1) {
          img = imagesRef.current[nearestIdx];
        } else {
          return;
        }
      }

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
  }, [isReady]);

  if (!isMounted) return null;

  // Calculate actual display percentage dynamically based on step scaling
  const maxPossibleFrames = isMobile ? Math.ceil(TOTAL_FRAMES / 3) + 1 : TOTAL_FRAMES;
  const pct = Math.min(100, Math.round((loadedCount / maxPossibleFrames) * 100));

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
            filter: isMobile ? "none" : "contrast(1.06) brightness(1.03) saturate(1.03)",
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
