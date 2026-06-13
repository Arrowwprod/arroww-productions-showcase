import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState, useRef, useMemo } from "react";
import logoImg from "../../arww_logo.png";

const items = [
  { label: "Philosophy", href: "#philosophy" },
  { label: "Services", href: "#services" },
  { label: "Workflow", href: "#workflow" },
];

function squircleRadius(r: number) {
  return {
    borderRadius: r,
    cornerShape: "squircle" as any,
  };
}

function MagnifiedItem({
  mouseX,
  children,
  style,
  distanceInfluence = 150,
  maxScale = 1.25,
}: {
  mouseX: any;
  children: React.ReactNode;
  style?: React.CSSProperties;
  distanceInfluence?: number;
  maxScale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Spring magnification curves matching Framer Apple-Dock component (150px influence)
  const scaleSync = useTransform(
    distance,
    [-distanceInfluence, 0, distanceInfluence],
    [1.0, maxScale, 1.0]
  );
  
  const scale = useSpring(scaleSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{
        scale,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

function FollowEyes({
  eyeSize = 14,
  pupilSize = 5.5,
  eyeSpacing = 3,
  eyeColor = "#000",
  pupilColor = "#fff",
  trackingRange = 85,
  enableBlinking = true,
  blinkInterval = 3000,
}: {
  eyeSize?: number;
  pupilSize?: number;
  eyeSpacing?: number;
  eyeColor?: string;
  pupilColor?: string;
  trackingRange?: number;
  enableBlinking?: boolean;
  blinkInterval?: number;
}) {
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const [isBlinking, setIsBlinking] = useState(false);

  const leftPupilX = useMotionValue(0);
  const leftPupilY = useMotionValue(0);
  const rightPupilX = useMotionValue(0);
  const rightPupilY = useMotionValue(0);

  const springConfig = { stiffness: 220, damping: 16 };
  const leftSpringX = useSpring(leftPupilX, springConfig);
  const leftSpringY = useSpring(leftPupilY, springConfig);
  const rightSpringX = useSpring(rightPupilX, springConfig);
  const rightSpringY = useSpring(rightPupilY, springConfig);

  const maxDistance = useMemo(() => {
    return ((eyeSize - pupilSize) / 2) * (trackingRange / 100);
  }, [eyeSize, pupilSize, trackingRange]);

  // Blink interval
  useEffect(() => {
    if (!enableBlinking) return;
    const blinkDuration = 180;
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, blinkDuration);
    }, blinkInterval);
    return () => clearInterval(interval);
  }, [enableBlinking, blinkInterval]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Left eye calculation
      if (leftEyeRef.current) {
        const rect = leftEyeRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance === 0) {
          leftPupilX.set(0);
          leftPupilY.set(0);
        } else {
          const clampedDistance = Math.min(distance, maxDistance);
          const angle = Math.atan2(dy, dx);
          leftPupilX.set(Math.cos(angle) * clampedDistance);
          leftPupilY.set(Math.sin(angle) * clampedDistance);
        }
      }

      // Right eye calculation
      if (rightEyeRef.current) {
        const rect = rightEyeRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance === 0) {
          rightPupilX.set(0);
          rightPupilY.set(0);
        } else {
          const clampedDistance = Math.min(distance, maxDistance);
          const angle = Math.atan2(dy, dx);
          rightPupilX.set(Math.cos(angle) * clampedDistance);
          rightPupilY.set(Math.sin(angle) * clampedDistance);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [maxDistance, leftPupilX, leftPupilY, rightPupilX, rightPupilY]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: eyeSpacing,
        height: eyeSize,
        overflow: "visible",
      }}
    >
      {/* Left Eye */}
      <div
        ref={leftEyeRef}
        style={{
          width: eyeSize,
          height: eyeSize,
          borderRadius: "50%",
          overflow: "hidden",
          position: "relative",
          backgroundColor: eyeColor,
        }}
      >
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transformOrigin: "center",
          }}
          animate={{ scaleY: isBlinking ? 0.25 : 1 }}
          transition={{ duration: 0.12, ease: "easeInOut" }}
        >
          <motion.div
            style={{
              width: pupilSize,
              height: pupilSize,
              borderRadius: "50%",
              backgroundColor: pupilColor,
              opacity: isBlinking ? 0 : 1,
              x: leftSpringX,
              y: leftSpringY,
            }}
          />
        </motion.div>
      </div>

      {/* Right Eye */}
      <div
        ref={rightEyeRef}
        style={{
          width: eyeSize,
          height: eyeSize,
          borderRadius: "50%",
          overflow: "hidden",
          position: "relative",
          backgroundColor: eyeColor,
        }}
      >
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transformOrigin: "center",
          }}
          animate={{ scaleY: isBlinking ? 0.25 : 1 }}
          transition={{ duration: 0.12, ease: "easeInOut" }}
        >
          <motion.div
            style={{
              width: pupilSize,
              height: pupilSize,
              borderRadius: "50%",
              backgroundColor: pupilColor,
              opacity: isBlinking ? 0 : 1,
              x: rightSpringX,
              y: rightSpringY,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}

export function Dock() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mouseX = useMotionValue(Infinity);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      style={{
        position: "fixed",
        top: isMobile ? 16 : 24,
        left: "50%",
        // On mobile: fill viewport minus 32px margins; desktop: auto (pill hugs content)
        width: isMobile ? "calc(100vw - 32px)" : "auto",
        zIndex: 50,
        overflow: "visible",
      }}
      aria-label="Application Dock"
      role="menubar"
    >
      <motion.div
        layout
        transition={{
          layout: { type: "spring", mass: 0.1, stiffness: 150, damping: 12 },
        }}
        style={{
          display: "flex",
          alignItems: "center",
          // On mobile: full-width space-between; on desktop: compact gap
          justifyContent: isMobile ? "space-between" : "flex-start",
          gap: isMobile ? 0 : 8,
          width: isMobile ? "100%" : "auto",
          padding: isMobile
            ? (scrolled ? "9px 16px" : "11px 18px")
            : (scrolled ? "10px 18px" : "12px 24px"),
          position: "relative",
          overflow: "visible",
          transition: "padding 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          boxSizing: "border-box",
          
          // ── Core squircle and glass fill ─────────────────────────
          ...squircleRadius(999),
          background: scrolled
            ? "linear-gradient(160deg, rgba(15, 15, 15, 0.8) 0%, rgba(5, 5, 5, 0.92) 100%)"
            : "linear-gradient(160deg, rgba(20, 20, 20, 0.65) 0%, rgba(10, 10, 10, 0.82) 100%)",
          backdropFilter: "blur(28px) saturate(200%) brightness(0.95)",
          WebkitBackdropFilter: "blur(28px) saturate(200%) brightness(0.95)",
          
          // ── Border: subtle outer ring ────────────────────────────
          border: "1px solid rgba(255, 255, 255, 0.12)",
          
          // ── Shadows: outer depth + inner top specular ────────────
          boxShadow: [
            "0 0 0 0.5px rgba(0, 0, 0, 0.3)",
            "0 12px 40px rgba(0, 0, 0, 0.56)",
            "0 2px 8px rgba(0, 0, 0, 0.2)",
            "inset 0 1.5px 0 rgba(255, 255, 255, 0.15)",
            "inset 0 -1px 0 rgba(0, 0, 0, 0.4)",
            "inset 0 0 24px rgba(255, 255, 255, 0.04)"
          ].join(", "),
        }}
      >
        {/* Layer 1 Reflection overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            ...squircleRadius(999),
            backgroundColor: "rgba(255, 255, 255, 0.015)",
            mixBlendMode: "overlay",
            pointerEvents: "none",
          }}
        />

        {/* Layer 2 Specular highlight overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            ...squircleRadius(999),
            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.00) 60%)",
            mixBlendMode: "overlay",
            boxShadow: "inset 1.5px 1.5px 1px -1px rgba(255, 255, 255, 0.3), inset -1.5px -1.5px 1px -1px rgba(255, 255, 255, 0.05)",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <MagnifiedItem mouseX={mouseX}>
          <a
            href="#hero"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: isMobile ? "6px 10px 6px 4px" : "7px 16px 7px 9px",
              ...squircleRadius(999),
              textDecoration: "none",
              transition: "background 0.2s",
              position: "relative",
              zIndex: 2,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <img
              src={logoImg}
              alt="Arroww"
              style={{
                height: isMobile ? 22 : 25,
                width: "auto",
                objectFit: "contain",
                filter: "brightness(0) invert(1)",
                opacity: 0.9,
              }}
            />
            <span
              style={{
                fontSize: isMobile ? 15 : 16,
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.92)",
                letterSpacing: "-0.02em",
              }}
            >
              Arroww
            </span>
          </a>
        </MagnifiedItem>

        {!isMobile && (
          <MagnifiedItem mouseX={mouseX}>
            <div
              style={{
                width: 1,
                height: 23,
                background: "rgba(255, 255, 255, 0.08)",
                margin: "0 5px",
              }}
            />
          </MagnifiedItem>
        )}

        {/* Nav links (Magnified) — hidden on mobile */}
        <ul
          style={{
            display: isMobile ? "none" : "flex",
            alignItems: "center",
            gap: 4,
            listStyle: "none",
            margin: 0,
            padding: 0,
            overflow: "visible",
            zIndex: 2,
          }}
        >
          {items.map((it) => (
            <li key={it.href} style={{ display: "flex", alignItems: "center" }}>
              <MagnifiedItem mouseX={mouseX}>
                <a
                  href={it.href}
                  style={{
                    fontSize: 15.5,
                    padding: "8px 16px",
                    ...squircleRadius(999),
                    color: "rgba(255, 255, 255, 0.6)",
                    textDecoration: "none",
                    display: "block",
                    transition: "color 0.2s, background 0.2s",
                    letterSpacing: "-0.01em",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {it.label}
                </a>
              </MagnifiedItem>
            </li>
          ))}
        </ul>

        {/* CTA (Let's Talk - Magnified) */}
        <MagnifiedItem mouseX={mouseX}>
          <a
            href="#contact"
            style={{
              marginLeft: isMobile ? "auto" : 5,
              fontSize: isMobile ? 13.5 : 15,
              fontWeight: 600,
              padding: isMobile ? "8px 16px 8px 18px" : "7px 16px 7px 18px",
              ...squircleRadius(999),
              background: "#fff",
              color: "#000",
              textDecoration: "none",
              letterSpacing: "-0.01em",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              position: "relative",
              zIndex: 2,
              transition: "opacity 0.2s, transform 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = "0.88";
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <span>Let's talk</span>
            <FollowEyes
              eyeSize={15}
              pupilSize={5.5}
              eyeSpacing={3.5}
              eyeColor="#000"
              pupilColor="#fff"
            />
          </a>
        </MagnifiedItem>
      </motion.div>
    </motion.nav>
  );
}
