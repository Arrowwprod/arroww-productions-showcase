import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    n: "01",
    title: "Branding",
    desc: "Identity systems, naming, narrative and art direction that compound.",
  },
  {
    n: "02",
    title: "Marketing",
    desc: "Full-funnel campaigns engineered for measurable, repeatable growth.",
  },
  {
    n: "03",
    title: "Graphic Design",
    desc: "Editorial-grade visuals across print, packaging and digital surfaces.",
  },
  {
    n: "04",
    title: "PR",
    desc: "Strategic press, partnerships and positioning that earns coverage.",
  },
  {
    n: "05",
    title: "Website Development",
    desc: "Fast, accessible, animated websites — built like Apple keynotes.",
  },
  {
    n: "06",
    title: "Digital Identity Package",
    desc: "One cohesive system: logo, web, social, deck, motion, voice.",
  },
  {
    n: "07",
    title: "Business Process Automation",
    desc: "AI workflows, CRM, ops — quietly compounding hours back to you.",
  },
  {
    n: "08",
    title: "Social Media Marketing",
    desc: "Native-first content engines for IG, TikTok, LinkedIn and X.",
  },
  {
    n: "09",
    title: "Content",
    desc: "Film, photo, podcast and editorial — story at production quality.",
  },
  {
    n: "10",
    title: "Growth Strategy",
    desc: "Quarterly bets, experiments and dashboards that move the line.",
  },
];

export function Services() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".svc-head", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });

      gsap.utils.toArray<HTMLElement>(".svc-card").forEach((card, i) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "expo.out",
          delay: (i % 3) * 0.08,
          scrollTrigger: { trigger: card, start: "top 88%" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={root} className="relative py-32 sm:py-48 px-6 bg-muted/40">
      <div className="mx-auto max-w-7xl">
        <div className="svc-head flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-6 text-sm text-muted-foreground">
              <span className="h-px w-10 bg-foreground/30" />
              <span className="uppercase tracking-[0.2em] text-xs">Services</span>
            </div>
            <h2 className="text-balance text-[clamp(2rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.035em]">
              Ten disciplines.
              <br />
              <span className="text-muted-foreground">One studio.</span>
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground text-pretty">
            Hire a single team for the full stack of brand, growth and product —
            without the agency overhead.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <article
              key={s.n}
              className="svc-card apple-card group relative p-7 sm:p-8 overflow-hidden"
            >
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-10">
                <span>{s.n}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  →
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
              <div
                className="pointer-events-none absolute -bottom-24 -right-24 w-56 h-56 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0 0 0 / 0.08), transparent 60%)",
                }}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
