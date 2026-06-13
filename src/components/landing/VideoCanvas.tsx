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

  // SSR guard
  useEffect(() => { setIsMounted(true); }, []);

  // ── Preload all WebP frames with GPU pre-decoding ──────────────────────────
  useEffect(() => {
    if (!isMounted) return;
    let active = true;
    let loaded = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/frames/frame_${String(i).padStart(3, "0")}.webp`;
      images.push(img);

      const done = () => {
        if (!active) return;
        loaded++;
        setLoadedCount(loaded);
        if (loaded === TOTAL_FRAMES) setIsReady(true);
      };

      if (img.complete && img.naturalWidth > 0) {
        done();
      } else {
        // Decode image on the GPU asynchronously before marking as loaded
        img.decode()
          .then(done)
          .catch(done);
      }
    }
    imagesRef.current = images;
    return () => { active = false; };
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
      const i   = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(idx)));
      const img = imagesRef.current[i];
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
  }, [isReady]);

  if (!isMounted) return null;

  const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);

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
      }}>
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width: "100vw",
            height: "100vh",
            imageRendering: "auto",
            filter: "contrast(1.06) brightness(1.03) saturate(1.03)",
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
