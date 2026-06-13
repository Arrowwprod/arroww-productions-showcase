import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const headline = "We craft brands that move people.";

function StartProjectButton() {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
  };

  // Border spotlight gradient
  const spotlightBg = useMotionTemplate`radial-gradient(130px circle at ${glowX}px ${glowY}px, rgba(255, 255, 255, 0.8), transparent 100%)`;

  return (
    <motion.a
      ref={buttonRef}
      href="#contact"
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={handlePointerLeave}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        padding: 1.5, // acts as the border width
        textDecoration: "none",
        background: isHovered ? spotlightBg : "rgba(255, 255, 255, 0.25)",
        transition: "background 0.3s ease",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          borderRadius: 998,
          background: "#fff",
          color: "#000",
          padding: "12.5px 26.5px", // compensates for the 1.5px border
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          transition: "box-shadow 0.3s ease",
          boxShadow: isHovered ? "0 8px 30px rgba(255,255,255,0.18)" : "none",
        }}
      >
        Start a project <span style={{ display: "inline-block", transition: "transform 0.2s", transform: isHovered ? "translateX(3px)" : "none" }}>→</span>
      </div>
    </motion.a>
  );
}

function ExploreServicesButton() {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
  };

  // Border spotlight gradient
  const spotlightBg = useMotionTemplate`radial-gradient(130px circle at ${glowX}px ${glowY}px, rgba(255, 255, 255, 0.45), transparent 100%)`;

  return (
    <motion.a
      ref={buttonRef}
      href="#services"
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={handlePointerLeave}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        padding: 1, // acts as the border width
        textDecoration: "none",
        background: isHovered ? spotlightBg : "rgba(255, 255, 255, 0.18)",
        transition: "background 0.3s ease",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          borderRadius: 998, // slightly smaller than parent to nest perfectly
          color: isHovered ? "#fff" : "rgba(255, 255, 255, 0.85)",
          padding: "13px 27px", // compensates for the 1px padding
          fontSize: 14,
          fontWeight: 500,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          background: isHovered ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.04)",
          transition: "background 0.3s, color 0.3s",
        }}
      >
        Explore services
      </div>
    </motion.a>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = titleRef.current?.querySelectorAll(".word") ?? [];
      gsap.from(words, {
        yPercent: 110,
        opacity: 0,
        duration: 1.3,
        ease: "expo.out",
        stagger: 0.07,
        delay: 0.3,
      });
      gsap.to(titleRef.current, {
        yPercent: -18,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={root}
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        overflow: "hidden",
        paddingBottom: "5rem",
        paddingTop: "9rem",
      }}
    >
      <div style={{ position: "relative", margin: "0 auto", width: "100%", maxWidth: 1400, padding: "0 1.5rem" }}>

        {/* Main headline */}
        <h1
          ref={titleRef}
          style={{
            fontSize: "clamp(2.8rem,9.5vw,10rem)",
            fontWeight: 600,
            lineHeight: 0.9,
            letterSpacing: "-0.045em",
            color: "#fff",
            margin: 0,
          }}
        >
          {headline.split(" ").map((w, i) => (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", marginRight: "0.22em", paddingBottom: "0.2em", marginBottom: "-0.2em" }}>
              <span className="word" style={{ display: "inline-block" }}>{w}</span>
            </span>
          ))}
        </h1>

        {/* Bottom row */}
        <div style={{ marginTop: "3rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
          <p
            style={{ 
              maxWidth: 520, 
              fontSize: "clamp(1rem, 1.6vw, 1.2rem)", 
              color: "rgba(255,255,255,0.72)", 
              lineHeight: 1.65, 
              margin: 0,
              textShadow: "0 2px 8px rgba(0,0,0,0.5)"
            }}
          >
            A full-stack media &amp; marketing studio building cinematic
            identities, growth engines, and digital products for ambitious teams.
          </p>

          <div
            style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}
          >
            <StartProjectButton />
            <ExploreServicesButton />
          </div>
        </div>

      </div>
    </section>
  );
}
