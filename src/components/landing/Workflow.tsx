import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const workflowSteps = [
  {
    n: "01",
    phase: "Intake",
    title: "The Nock",
    desc: "Every relationship starts with a real conversation, not a form. We listen, build context, and identify the Peak of your brand's potential. We lock the target before moving.",
  },
  {
    n: "02",
    phase: "Strategy",
    title: "The Draw",
    desc: "We enter the War Room with audience intelligence and media psychology. Here, creative direction is held under deliberate, calculated tension before release.",
  },
  {
    n: "03",
    phase: "Execution",
    title: "The Strike",
    desc: "We deploy the full Quiver. Brand systems, advertising campaigns, and high-velocity digital products are launched with absolute precision. We whisper to no one.",
  },
  {
    n: "04",
    phase: "Tracking",
    title: "The Flight",
    desc: "Campaigns in motion are measured honestly. We track performance against the Needle: does this move the business? If a deliverable doesn't, we pull it back.",
  },
];

function getGridSpan(index: number, isMobile: boolean) {
  if (isMobile) return { gridColumn: "span 1", gridRow: "span 1" };
  switch (index) {
    case 0: // The Nock (Row 1, left/middle)
      return { gridColumn: "span 2", gridRow: "span 1" };
    case 1: // The Draw (Row 1-2, right tall card)
      return { gridColumn: "span 1", gridRow: "span 2" };
    case 2: // The Strike (Row 2, left/middle)
      return { gridColumn: "span 2", gridRow: "span 1" };
    case 3: // The Flight (Row 3, bottom full width)
      return { gridColumn: "span 3", gridRow: "span 1" };
    default:
      return {};
  }
}

function WorkflowVisual({ activeStep }: { activeStep: number }) {
  let bowD = "M 60 40 Q 110 130 60 220";
  let stringD = "M 60 40 L 60 220";
  let arrowOpacity = 1;
  let arrowX1 = 60;
  let arrowX2 = 160;
  let targetOpacity = 0;
  let nockGlowOpacity = 0;
  let drawGlowOpacity = 0;
  let strikeStreakOpacity = 0;

  // Live targeting HUD console logs
  let hudLine1 = "SYS.MODE: NOCK_MODE // NOCK_LOCK: TRUE";
  let hudLine2 = "TENSION: RELX_00% // TARGET: SECTOR_PEAK";

  if (activeStep === 0) {
    bowD = "M 60 40 Q 110 130 60 220";
    stringD = "M 60 40 L 60 220";
    arrowOpacity = 1;
    arrowX1 = 60;
    arrowX2 = 160;
    nockGlowOpacity = 1;
    hudLine1 = "SYS.MODE: NOCK_MODE // NOCK_LOCK: TRUE";
    hudLine2 = "TENSION: RELX_00% // TARGET: SECTOR_PEAK";
  } else if (activeStep === 1) {
    bowD = "M 60 40 Q 155 130 60 220";
    stringD = "M 60 40 Q 160 130 60 220";
    arrowOpacity = 1;
    arrowX1 = 160;
    arrowX2 = 250;
    drawGlowOpacity = 0.8;
    hudLine1 = "SYS.MODE: DRAW_MODE // WAR_ROOM: ACTIVE";
    hudLine2 = "TENSION: FULL_D100 // TRAJECTORY: LOCKED";
  } else if (activeStep === 2) {
    bowD = "M 60 40 Q 85 130 60 220";
    stringD = "M 60 40 L 60 220";
    arrowOpacity = 0;
    arrowX1 = 280;
    arrowX2 = 360;
    strikeStreakOpacity = 0.95;
    hudLine1 = "SYS.MODE: STRIKE_RUN // RELEASE_SNAP: EXEC";
    hudLine2 = "VELOCITY: 850m/s // QUIVER_RELEASE: HIGH";
  } else if (activeStep === 3) {
    bowD = "M 60 40 Q 110 130 60 220";
    stringD = "M 60 40 L 60 220";
    arrowOpacity = 0;
    arrowX1 = 60;
    arrowX2 = 160;
    targetOpacity = 1;
    hudLine1 = "SYS.MODE: FLIGHT_TRACK // LIVE_RADAR: SCAN";
    hudLine2 = "IMPACT: 100%_HIT // NEEDLE_SHIFT: ACTIVE";
  }

  return (
    <svg
      width="100%"
      height="250"
      viewBox="0 0 360 260"
      style={{
        overflow: "visible",
        background: "rgba(255,255,255,0.015)",
        borderRadius: "1.25rem",
        border: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        padding: "1.2rem",
        boxSizing: "border-box",
      }}
    >
      <defs>
        {/* Gradient for Strike streak */}
        <linearGradient id="strikeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="70%" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="100%" stopColor="rgba(255,255,255,1)" />
        </linearGradient>
        {/* Glow filter */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background grid lines to feel like a blueprint / tactical target reticle */}
      <g opacity={0.06}>
        <line x1={0} y1={130} x2={360} y2={130} stroke="#fff" strokeWidth={1} strokeDasharray="4 6" />
        <line x1={60} y1={0} x2={60} y2={260} stroke="#fff" strokeWidth={1} strokeDasharray="4 6" />
        <line x1={240} y1={0} x2={240} y2={260} stroke="#fff" strokeWidth={1} strokeDasharray="4 6" />
      </g>

      {/* Floating wind lines (high velocity indicators) */}
      {(activeStep === 2 || activeStep === 3) && (
        <g opacity={0.15}>
          <motion.line
            x1={120}
            y1={75}
            x2={180}
            y2={75}
            stroke="#fff"
            strokeWidth={1}
            animate={{ x: [-150, 250] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
          />
          <motion.line
            x1={70}
            y1={175}
            x2={130}
            y2={175}
            stroke="#fff"
            strokeWidth={1}
            animate={{ x: [-150, 250] }}
            transition={{ repeat: Infinity, duration: 1.3, ease: "linear", delay: 0.3 }}
          />
          <motion.line
            x1={190}
            y1={55}
            x2={240}
            y2={55}
            stroke="#fff"
            strokeWidth={1}
            animate={{ x: [-150, 250] }}
            transition={{ repeat: Infinity, duration: 1.9, ease: "linear", delay: 0.6 }}
          />
        </g>
      )}

      {/* Bow Structure (Morphing) */}
      <motion.path
        d={bowD}
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth={3}
        strokeLinecap="round"
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
      />
      <motion.path
        d={bowD}
        fill="none"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        filter="url(#glow)"
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
      />

      {/* Bowstring (Morphing) */}
      <motion.path
        d={stringD}
        fill="none"
        stroke="rgba(255,255,255,0.38)"
        strokeWidth={1.5}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
      />

      {/* Arrow (Moving/Morphing) */}
      <motion.g
        opacity={arrowOpacity}
        transition={{ duration: 0.3 }}
      >
        {/* Arrow shaft */}
        <motion.line
          x1={arrowX1}
          y1={130}
          x2={arrowX2}
          y2={130}
          stroke="rgba(255,255,255,0.85)"
          strokeWidth={2}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
        />
        {/* Arrow head */}
        <motion.path
          d={`M ${arrowX2} 126 L ${arrowX2 + 8} 130 L ${arrowX2} 135 Z`}
          fill="#fff"
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
        />
      </motion.g>

      {/* Nock Glow (Intake Mode Indicator) */}
      {nockGlowOpacity > 0 && (
        <g>
          <circle cx={60} cy={130} r={4} fill="#fff" />
          <motion.circle
            cx={60}
            cy={130}
            r={4}
            fill="none"
            stroke="#fff"
            strokeWidth={1.5}
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 3.2, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeOut" }}
          />
        </g>
      )}

      {/* Draw Tension Glow & Force Vectors (Strategy Mode) */}
      {drawGlowOpacity > 0 && (
        <g>
          <circle cx={160} cy={130} r={4} fill="#fff" />
          <motion.circle
            cx={160}
            cy={130}
            r={4}
            fill="none"
            stroke="#fff"
            strokeWidth={1.5}
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 3.8, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeOut" }}
          />
          {/* Tension lines flowing towards nock pivot */}
          <motion.line
            x1={60}
            y1={40}
            x2={160}
            y2={130}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={1}
            strokeDasharray="4 4"
            animate={{ strokeDashoffset: [0, -10] }}
            transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
          />
          <motion.line
            x1={60}
            y1={220}
            x2={160}
            y2={130}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={1}
            strokeDasharray="4 4"
            animate={{ strokeDashoffset: [0, -10] }}
            transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
          />
        </g>
      )}

      {/* Strike Speed Streak */}
      {activeStep === 2 && (
        <motion.g
          opacity={strikeStreakOpacity}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* High speed streak line */}
          <motion.line
            x1={40}
            y1={130}
            x2={340}
            y2={130}
            stroke="url(#strikeGradient)"
            strokeWidth={3}
            initial={{ x: -180 }}
            animate={{ x: 260 }}
            transition={{ duration: 0.55, ease: "easeOut", repeat: Infinity, repeatDelay: 0.25 }}
          />
        </motion.g>
      )}

      {/* Target Reticle & Scanning Radar Sweep (Flight / Tracking Mode) */}
      <motion.g
        opacity={targetOpacity}
        style={{ pointerEvents: "none" }}
        transition={{ duration: 0.4 }}
      >
        {/* Target bullseye */}
        <circle cx={240} cy={130} r={18} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
        <circle cx={240} cy={130} r={8} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
        <circle cx={240} cy={130} r={2.5} fill="#fff" />

        {/* Embedded Arrow */}
        {activeStep === 3 && (
          <>
            <line x1={180} y1={130} x2={239} y2={130} stroke="rgba(255,255,255,0.9)" strokeWidth={2} />
            <path d="M 239 126 L 243 130 L 239 134 Z" fill="#fff" />
            <path d="M 180 125 L 186 130 L 180 135 Z" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
            
            {/* Dynamic scanning radar sweep */}
            <motion.g
              style={{ transformOrigin: "240px 130px" }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.8, ease: "linear" }}
            >
              <line x1={240} y1={130} x2={240} y2={92} stroke="rgba(255,255,255,0.35)" strokeWidth={1.2} />
              <path d="M 240 130 L 240 92 A 38 38 0 0 1 270 105 Z" fill="rgba(255,255,255,0.025)" />
            </motion.g>
          </>
        )}

        {/* Dynamic Ripples */}
        {activeStep === 3 && (
          <>
            <motion.circle
              cx={240}
              cy={130}
              r={18}
              fill="none"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth={1}
              initial={{ r: 18, opacity: 0.9 }}
              animate={{ r: 90, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeOut" }}
            />
            <motion.circle
              cx={240}
              cy={130}
              r={18}
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={1}
              initial={{ r: 18, opacity: 0.9 }}
              animate={{ r: 130, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeOut", delay: 0.5 }}
            />
          </>
        )}
      </motion.g>

      {/* HUD terminal readouts */}
      <g opacity={0.52} style={{ fontFamily: "monospace", fontSize: 9.5, fill: "rgba(255,255,255,0.65)", letterSpacing: "0.06em" }}>
        <text x={20} y={224} fill="rgba(255,255,255,0.22)">[</text>
        <text x={330} y={224} fill="rgba(255,255,255,0.22)">]</text>
        <text x={20} y={242} fill="rgba(255,255,255,0.22)">[</text>
        <text x={330} y={242} fill="rgba(255,255,255,0.22)">]</text>

        <motion.text
          key={`hud1-${activeStep}`}
          initial={{ opacity: 0, x: 26 }}
          animate={{ opacity: 1, x: 30 }}
          transition={{ duration: 0.2 }}
          x={30}
          y={224}
        >
          {hudLine1}
        </motion.text>
        
        <motion.text
          key={`hud2-${activeStep}`}
          initial={{ opacity: 0, x: 26 }}
          animate={{ opacity: 1, x: 30 }}
          transition={{ duration: 0.2 }}
          x={30}
          y={242}
        >
          {hudLine2}
        </motion.text>
      </g>
    </svg>
  );
}

function WorkflowCard({
  w,
  index,
  isMobile,
  isActive,
  onHoverStart,
  onHoverEnd,
}: {
  w: typeof workflowSteps[0];
  index: number;
  isMobile: boolean;
  isActive: boolean;
  onHoverStart: (idx: number) => void;
  onHoverEnd: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  const spanStyle = getGridSpan(index, isMobile);
  const highlighted = hovered || isActive;

  return (
    <article
      ref={cardRef}
      className={`wf-card wf-card-${index}`}
      onMouseEnter={() => {
        setHovered(true);
        onHoverStart(index);
      }}
      onMouseLeave={() => {
        setHovered(false);
        onHoverEnd();
      }}
      onMouseMove={handleMouseMove}
      style={{
        position: "relative",
        padding: isMobile ? "2.5rem 2rem" : "1.8rem 1.5rem",
        borderRadius: "1.75rem",
        
        // ── Liquid Glass styling ───────────────────────────────────
        background: hovered
          ? "linear-gradient(160deg, rgba(255, 255, 255, 0.085) 0%, rgba(255, 255, 255, 0.04) 100%)"
          : (isActive
              ? "linear-gradient(160deg, rgba(255, 255, 255, 0.055) 0%, rgba(255, 255, 255, 0.015) 100%)"
              : "linear-gradient(160deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.005) 100%)"),
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: highlighted 
          ? (hovered ? "1px solid rgba(255, 255, 255, 0.18)" : "1px solid rgba(255, 255, 255, 0.12)") 
          : "1px solid rgba(255, 255, 255, 0.06)",
        boxShadow: hovered
          ? "inset 0 1.5px 0 rgba(255, 255, 255, 0.16), 0 16px 40px rgba(0, 0, 0, 0.45)"
          : (isActive
              ? "inset 0 1.5px 0 rgba(255, 255, 255, 0.12), 0 8px 30px rgba(0, 0, 0, 0.3)"
              : "inset 0 1.5px 0 rgba(255, 255, 255, 0.04), 0 4px 15px rgba(0, 0, 0, 0.15)"),
        
        overflow: "hidden",
        cursor: "default",
        transition: "background 0.35s ease, transform 0.3s ease, border-color 0.3s ease, box-shadow 0.35s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0px)",
        
        // Bento layout rules
        ...spanStyle,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: isMobile ? "auto" : (index === 1 ? "100%" : "185px"),
        boxSizing: "border-box",
      }}
    >
      {/* Glow border beam following cursor */}
      <div
        aria-hidden="true"
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          borderRadius: "1.75rem",
          background: `radial-gradient(160px circle at var(--x, 0px) var(--y, 0px), rgba(255, 255, 255, 0.28), transparent 75%)`,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: 1.5, // border width
          boxSizing: "border-box",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.35s ease",
        }}
      />

      {/* Number + Subtitle row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <span style={{ 
          display: "inline-block", fontSize: 11, fontFamily: "monospace", 
          color: highlighted ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.18)", 
          letterSpacing: "0.1em",
          transition: "color 0.3s"
        }}>
          {w.n}
        </span>
        <span style={{
          fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
          color: highlighted ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.22)",
          padding: "4px 10px", borderRadius: 999,
          border: `1px solid ${highlighted ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)"}`,
          transition: "color 0.3s, border-color 0.3s",
        }}>
          {w.phase}
        </span>
      </div>

      {/* Title & Description grouped */}
      <div>
        <h3 style={{
          fontSize: "clamp(1.4rem, 2vw, 1.6rem)",
          fontWeight: 600,
          letterSpacing: "-0.03em",
          color: highlighted ? "#fff" : "rgba(255,255,255,0.85)",
          marginBottom: "0.75rem",
          lineHeight: 1.15,
          transition: "color 0.3s"
        }}>
          {w.title}
        </h3>

        <p style={{
          fontSize: 13.5,
          color: highlighted ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.42)",
          lineHeight: 1.6,
          margin: 0,
          maxWidth: index === 3 ? 800 : "100%",
          transition: "color 0.3s"
        }}>
          {w.desc}
        </p>
      </div>

      {/* Glow on hover */}
      <div style={{
        position: "absolute", bottom: -80, right: -80,
        width: 200, height: 200, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.04), transparent 65%)",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.5s",
        pointerEvents: "none",
      }} />
    </article>
  );
}

export function Workflow() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Store hoveredIndex in a ref to keep it accessible inside scrollTrigger callbacks without closures
  const hoveredIndexRef = useRef<number | null>(null);
  hoveredIndexRef.current = hoveredIndex;

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // Autoplay loop timer (runs only when the user is not hovering)
  useEffect(() => {
    if (hoveredIndex !== null) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % workflowSteps.length);
    }, 3200);

    return () => clearInterval(interval);
  }, [hoveredIndex]);

  useEffect(() => {
    const root = rootRef.current;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      // Fade in left header panel
      gsap.from(".wf-head-panel", {
        x: -30,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root,
          start: "top 80%",
        }
      });

      // Stagger fade-in for cards
      gsap.from(".wf-card", {
        y: 45,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: ".wf-grid",
          start: "top 85%",
        }
      });

      // Synchronize active card on scroll
      workflowSteps.forEach((_, i) => {
        ScrollTrigger.create({
          trigger: `.wf-card-${i}`,
          start: "top 55%",
          end: "bottom 45%",
          onEnter: () => {
            if (hoveredIndexRef.current === null) {
              setActiveStep(i);
            }
          },
          onEnterBack: () => {
            if (hoveredIndexRef.current === null) {
              setActiveStep(i);
            }
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      id="workflow"
      ref={rootRef}
      style={{ position: "relative", padding: isMobile ? "7rem 1.5rem" : "5.5rem 2rem", overflow: "hidden" }}
    >
      <div style={{ position: "absolute", top: 0, left: isMobile ? "1.5rem" : "2rem", right: isMobile ? "1.5rem" : "2rem", height: 1, background: "rgba(255,255,255,0.06)" }} />

      <div style={{
        margin: "0 auto",
        maxWidth: 1400,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "380px 1fr",
        gap: isMobile ? "1.5rem" : "1rem",
        alignItems: "stretch"
      }}>
        
        {/* Left Column: Head Info Panel */}
        <div
          className="wf-head-panel"
          style={{
            padding: isMobile ? "2rem 1.5rem" : "2.5rem 2rem",
            borderRadius: "1.75rem",
            background: "linear-gradient(160deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.005) 100%)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.09)",
            boxShadow: "inset 0 1.5px 0 rgba(255, 255, 255, 0.12), 0 8px 30px rgba(0, 0, 0, 0.3)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: isMobile ? "auto" : "100%",
            boxSizing: "border-box",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
              <span style={{ width: 32, height: 1, background: "rgba(255,255,255,0.25)", display: "inline-block" }} />
              <span style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Workflow</span>
            </div>

            <h2 style={{
              fontSize: isMobile ? "clamp(1.6rem, 5vw, 2.4rem)" : "clamp(1.8rem, 2.5vw, 2.4rem)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: "#fff",
              lineHeight: 1.12,
              marginBottom: "1rem"
            }}>
              How We Strike.
            </h2>

            <p style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.42)",
              lineHeight: 1.6,
              margin: 0,
              marginBottom: isMobile ? "0" : "0px",
            }}>
              We don't spray, we aim. Every engagement follows a deliberate trajectory from intake to impact. This is calculated media architecture.
            </p>
          </div>

          {/* Workflow progress SVG animator HUD — only on desktop */}
          {!isMobile && (
            <div style={{ marginTop: "1.5rem", width: "100%" }}>
              <WorkflowVisual activeStep={activeStep} />
            </div>
          )}
        </div>

        {/* Right Column: Bento Grid */}
        <div className="wf-grid" style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: isMobile ? "1rem" : "1rem"
        }}>
          {workflowSteps.map((w, i) => (
            <WorkflowCard 
              key={w.n} 
              w={w} 
              index={i} 
              isMobile={isMobile} 
              isActive={activeStep === i && hoveredIndex === null}
              onHoverStart={(idx) => {
                setHoveredIndex(idx);
                setActiveStep(idx);
              }}
              onHoverEnd={() => {
                setHoveredIndex(null);
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
