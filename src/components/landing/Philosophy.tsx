import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const text =
  "We believe great brands aren't designed — they're directed. Every pixel, frame and word is a frame in a film about who you are. We obsess over taste, tension, and timing.";

export function Philosophy() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = root.current?.querySelectorAll(".p-word") ?? [];
      gsap.fromTo(
        words,
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.05,
          scrollTrigger: {
            trigger: root.current,
            start: "top 70%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );

      gsap.from(".p-eyebrow", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "expo.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="philosophy"
      ref={root}
      className="relative py-32 sm:py-48 px-6"
    >
      <div className="mx-auto max-w-6xl">
        <div className="p-eyebrow flex items-center gap-3 mb-12 text-sm text-muted-foreground">
          <span className="h-px w-10 bg-foreground/30" />
          <span className="uppercase tracking-[0.2em] text-xs">Philosophy</span>
        </div>
        <p className="text-balance text-[clamp(1.75rem,4.5vw,3.75rem)] font-medium leading-[1.1] tracking-[-0.02em]">
          {text.split(" ").map((w, i) => (
            <span key={i} className="p-word inline-block mr-[0.25em]">
              {w}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
