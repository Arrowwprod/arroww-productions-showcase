import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const headline = "We craft brands that move people.";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = titleRef.current?.querySelectorAll(".word") ?? [];
      gsap.from(words, {
        yPercent: 110,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.06,
        delay: 0.2,
      });

      gsap.to(bgRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(orbRef.current, {
        yPercent: -40,
        scale: 1.15,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(titleRef.current, {
        yPercent: -20,
        opacity: 0.2,
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
      className="relative min-h-[100svh] flex items-end overflow-hidden pb-24 pt-40 grain"
    >
      {/* parallax bg */}
      <div ref={bgRef} className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/40" />
        <div
          ref={orbRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vmin] h-[80vmin] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, oklch(0.2 0 0 / 0.18), transparent 60%), radial-gradient(circle at 70% 70%, oklch(0 0 0 / 0.25), transparent 65%)",
            filter: "blur(20px)",
          }}
        />
        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6">

        <h1
          ref={titleRef}
          className="text-balance text-[clamp(2.75rem,9vw,9.5rem)] font-semibold leading-[0.92] tracking-[-0.04em]"
        >
          {headline.split(" ").map((w, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
              <span className="word inline-block">{w}</span>
            </span>
          ))}
        </h1>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-end sm:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1 }}
            className="max-w-xl text-base sm:text-lg text-muted-foreground text-pretty"
          >
            A full-stack media &amp; marketing studio building cinematic
            identities, growth engines, and digital products for ambitious teams.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            className="flex items-center gap-3"
          >
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium transition-transform hover:scale-[1.02]"
            >
              Start a project
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-6 py-3 text-sm font-medium hover:bg-foreground/5 transition-colors"
            >
              Explore services
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
