import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  { n: "01", title: "Branding", desc: "Identity systems, naming, narrative and art direction that compound over time.", tag: "Identity" },
  { n: "02", title: "Marketing", desc: "Full-funnel campaigns engineered for measurable, repeatable growth.", tag: "Growth" },
  { n: "03", title: "Graphic Design", desc: "Editorial-grade visuals across print, packaging and digital surfaces.", tag: "Visual" },
  { n: "04", title: "Public Relations", desc: "Strategic press, partnerships and positioning that earns coverage.", tag: "Press" },
  { n: "05", title: "Website Development", desc: "Fast, accessible, animated websites — built like Apple keynotes.", tag: "Digital" },
  { n: "06", title: "Digital Identity Package", desc: "One cohesive system: logo, web, social, deck, motion, voice.", tag: "System" },
  { n: "07", title: "Business Automation", desc: "AI workflows, CRM, ops — quietly compounding hours back to you.", tag: "AI" },
  { n: "08", title: "Social Media", desc: "Native-first content engines for IG, TikTok, LinkedIn and X.", tag: "Social" },
  { n: "09", title: "Content", desc: "Film, photo, podcast and editorial — story at production quality.", tag: "Film" },
  { n: "10", title: "Growth Strategy", desc: "Quarterly bets, experiments and dashboards that move the line.", tag: "Strategy" },
];

function ServiceCard({ s, index, isMobile }: { s: typeof services[0]; index: number; isMobile: boolean }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <article
      ref={cardRef}
      className={`svc-card svc-card-${index}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        position: "relative",
        flexShrink: isMobile ? 1 : 0,
        width: isMobile ? "100%" : 360,
        padding: "2.5rem 2rem",
        borderRadius: "1.75rem",
        border: "1px solid rgba(255,255,255,0.06)",
        background: hovered ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.025)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        overflow: "hidden",
        cursor: "default",
        transition: "background 0.35s ease, transform 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0px)",
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
          background: `radial-gradient(130px circle at var(--x, 0px) var(--y, 0px), rgba(255, 255, 255, 0.22), transparent 75%)`,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: 1.5, // border width
          boxSizing: "border-box",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.35s ease",
        }}
      />

      {/* Number + tag row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <span className="svc-num" style={{ display: "inline-block", fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>{s.n}</span>
        <span style={{
          fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
          color: hovered ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
          padding: "4px 10px", borderRadius: 999,
          border: `1px solid ${hovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)"}`,
          transition: "color 0.3s, border-color 0.3s",
        }}>
          {s.tag}
        </span>
      </div>

      <h3 style={{
        fontSize: "clamp(1.5rem, 2.2vw, 1.8rem)",
        fontWeight: 600,
        letterSpacing: "-0.03em",
        color: "#fff",
        marginBottom: "1rem",
        lineHeight: 1.15,
      }}>
        {s.title}
      </h3>

      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.65, margin: 0 }}>
        {s.desc}
      </p>

      {/* Arrow on hover */}
      <div style={{
        position: "absolute", bottom: "2.5rem", right: "2rem",
        fontSize: 18, color: "rgba(255,255,255,0.5)",
        opacity: hovered ? 1 : 0,
        transform: hovered ? "translate(0,0)" : "translate(-4px, 4px)",
        transition: "opacity 0.3s, transform 0.3s",
      }}>→</div>

      {/* Glow on hover / parallax */}
      <div className="svc-glow" style={{
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

export function Services() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const wrapper = wrapperRef.current;

    const ctx = gsap.context(() => {
      if (isMobile) {
        // Mobile layout simple stagger on entrance
        gsap.from(".svc-head", {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
          }
        });

        gsap.from(".svc-card", {
          y: 55,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
          }
        });
      } else {
        if (!track || !root || !wrapper) return;

        // Start track further right (at 48% of screen) to clear left header column initially
        const getStartX = () => window.innerWidth * 0.48;

        const getScrollAmount = () => {
          return getStartX() + (track.scrollWidth - wrapper.clientWidth);
        };

        // Timeline linked to ScrollTrigger pinning
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            pin: true,
            scrub: 1.2,
            start: "top top",
            end: () => `+=${getScrollAmount()}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          }
        });

        // Step 1: Smoothly fade out, blur, scale down, and translate the header text first
        tl.to(".svc-header-text", {
          opacity: 0,
          y: -40,
          filter: "blur(6px)",
          scale: 0.96,
          duration: 0.3,
          ease: "power2.inOut",
        }, 0);

        // Step 2: Stagger cards entry: translate the track horizontally with a delay
        const horizontalTween = tl.fromTo(track, 
          { x: () => getStartX() },
          {
            x: () => -(track.scrollWidth - wrapper.clientWidth),
            ease: "none",
            duration: 1,
          },
          0.15 // starts halfway through the fade-out, giving plenty of clearance
        );

        // Parallax animation for inner card elements (numbers & glow circles)
        gsap.utils.toArray<HTMLElement>(".svc-card").forEach((card) => {
          const glow = card.querySelector(".svc-glow");
          const num = card.querySelector(".svc-num");

          if (glow) {
            gsap.fromTo(glow, 
              { x: -40 },
              {
                x: 40,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: horizontalTween,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                }
              }
            );
          }

          if (num) {
            gsap.fromTo(num, 
              { x: -20 },
              {
                x: 20,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: horizontalTween,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                }
              }
            );
          }
        });

        // Elastic cards skew on scroll velocity
        let clamp = gsap.utils.clamp(-6, 6);
        
        ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          onUpdate: (self) => {
            const skew = clamp(self.getVelocity() / -350);
            gsap.to(".svc-card", {
              skewX: skew,
              duration: 0.35,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });

        const resetSkew = () => {
          gsap.to(".svc-card", {
            skewX: 0,
            duration: 0.45,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        ScrollTrigger.addEventListener("scrollEnd", resetSkew);
      }
    }, rootRef);

    return () => {
      ctx.revert();
    };
  }, [isMobile]);

  return (
    <section
      id="services"
      ref={rootRef}
      style={{
        position: "relative",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      {/* Divider */}
      <div style={{ position: "absolute", top: 0, left: "2rem", right: "2rem", height: 1, background: "rgba(255,255,255,0.06)" }} />

      {!isMobile ? (
        <div style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          boxSizing: "border-box",
        }}>
          {/* Centered Left-aligned Header Container (Fades along with scroll) */}
          <div className="svc-header-text" style={{
            position: "absolute",
            left: "max(2rem, calc((100vw - 1400px)/2 + 2rem))",
            width: "100%",
            maxWidth: 480,
            zIndex: 10,
            pointerEvents: "none",
            boxSizing: "border-box",
            willChange: "transform, opacity, filter",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
              <span style={{ width: 32, height: 1, background: "rgba(255,255,255,0.25)", display: "inline-block" }} />
              <span style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Services</span>
            </div>
            <h2 style={{
              fontSize: "clamp(2.4rem, 4vw, 4.5rem)",
              fontWeight: 600,
              lineHeight: 0.98,
              letterSpacing: "-0.04em",
              color: "#fff",
              margin: "0 0 2rem",
            }}>
              Ten disciplines.<br />
              <span style={{ color: "rgba(255,255,255,0.3)" }}>One studio.</span>
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.65, margin: 0 }}>
              Hire a single team for the full stack of brand, growth and product — without the agency overhead.
            </p>
          </div>

          {/* Full-width Cards Wrapper (Occupies the full axis) */}
          <div ref={wrapperRef} className="svc-right-wrapper" style={{ width: "100%", overflow: "hidden", position: "relative" }}>
            <div
              ref={trackRef}
              style={{
                display: "flex",
                gap: "2rem",
                padding: "2rem 0",
                width: "max-content",
                willChange: "transform",
              }}
            >
              {services.map((s, i) => (
                <ServiceCard key={s.n} s={s} index={i} isMobile={false} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Mobile Layout: standard vertical stack list */
        <div style={{ padding: "7rem 1.5rem 5rem", maxWidth: 1400, margin: "0 auto" }}>
          {/* Header */}
          <div className="svc-head" style={{ marginBottom: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
              <span style={{ width: 32, height: 1, background: "rgba(255,255,255,0.25)", display: "inline-block" }} />
              <span style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Services</span>
            </div>
            <h2 style={{
              fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
              fontWeight: 600,
              lineHeight: 0.98,
              letterSpacing: "-0.04em",
              color: "#fff",
              margin: "0 0 1.5rem",
            }}>
              Ten disciplines.<br />
              <span style={{ color: "rgba(255,255,255,0.3)" }}>One studio.</span>
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.65, margin: 0 }}>
              Hire a single team for the full stack of brand, growth and product — without the agency overhead.
            </p>
          </div>

          {/* Grid list */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
            {services.map((s, i) => (
              <ServiceCard key={s.n} s={s} index={i} isMobile={true} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
