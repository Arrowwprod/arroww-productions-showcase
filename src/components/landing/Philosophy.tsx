import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const text =
  "Every move is intentional, aimed, and released with complete purpose. No scattershot. No playing it safe. We guide ambitious brands toward their Peak — the highest version of what they were built to become.";

const pillars = [
  {
    n: "01",
    label: "On Propaganda",
    sub: "Media psychology is the engine.",
    desc: "We reclaim propaganda as the oldest, most honest description of powerful communication. Using research and creative precision to guide belief. This is not manipulation; it is craft.",
  },
  {
    n: "02",
    label: "The Creed",
    sub: "Lock the target first.",
    desc: "Clarity of goal is non-negotiable. We are dramatic because the world is loud — precision without drama is a whisper, and we whisper to no one. Our work announces itself.",
  },
  {
    n: "03",
    label: "Growth Strategy",
    sub: "The Burst and the Compound.",
    desc: "We play two games simultaneously: the Burst for immediate campaign momentum, and the Compound for long-game content that builds trust, authority, and compound value over time.",
  },
];

export function Philosophy() {
  const root = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = root.current?.querySelectorAll(".p-word") ?? [];
      gsap.fromTo(
        words,
        { opacity: 0.22, filter: "blur(1px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          stagger: 0.04,
          scrollTrigger: {
            trigger: root.current,
            start: "top 70%",
            end: "center 40%",
            scrub: true,
          },
        }
      );
      gsap.from(".phil-pillar", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".phil-pillars", start: "top 82%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="philosophy"
      ref={root}
      style={{ position: "relative", padding: isMobile ? "7rem 1.5rem" : "10rem 2rem", overflow: "hidden" }}
    >
      {/* Subtle horizontal rule */}
      <div style={{ position: "absolute", top: 0, left: isMobile ? "1.5rem" : "2rem", right: isMobile ? "1.5rem" : "2rem", height: 1, background: "rgba(255,255,255,0.06)" }} />

      <div style={{ margin: "0 auto", maxWidth: 1400 }}>
        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: isMobile ? "2.5rem" : "4rem" }}>
          <span style={{ width: 32, height: 1, background: "rgba(255,255,255,0.25)", display: "inline-block" }} />
          <span style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Philosophy</span>
        </div>

        {/* Scroll-revealed text */}
        <p style={{
          fontSize: isMobile ? "clamp(1.5rem,5.5vw,2.2rem)" : "clamp(1.8rem,4.5vw,3.8rem)",
          fontWeight: 500,
          lineHeight: 1.12,
          letterSpacing: "-0.025em",
          color: "#fff",
          maxWidth: 1100,
          margin: isMobile ? "0 0 4rem" : "0 0 6rem",
        }}>
          {text.split(" ").map((w, i) => (
            <span key={i} className="p-word" style={{ display: "inline-block", marginRight: "0.28em" }}>
              {w}
            </span>
          ))}
        </p>

        {/* Three pillars (Cardless Editorial Columns) */}
        <div className="phil-pillars" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))", gap: isMobile ? "2.5rem" : "3.5rem" }}>
          {pillars.map((p) => (
            <div
              key={p.label}
              className="phil-pillar"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
                paddingBottom: isMobile ? "2rem" : "0",
                borderBottom: isMobile ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              {/* Monospace Number */}
              <div style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em" }}>
                {p.n}
              </div>
              
              {/* Heading */}
              <h3 style={{ fontSize: isMobile ? "1.3rem" : "1.45rem", fontWeight: 600, letterSpacing: "-0.03em", color: "#fff", margin: 0 }}>
                {p.label}
              </h3>
              
              {/* Subtitle */}
              <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
                {p.sub}
              </div>
              
              {/* Description */}
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.65, margin: 0 }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
