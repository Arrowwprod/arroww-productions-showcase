import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".big-mark", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={ref} className="relative pt-24 pb-10 px-6 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-16 border-b border-foreground/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-foreground" />
              <span className="font-semibold tracking-tight">Arroww Productions</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              A media &amp; marketing studio directing the brands of tomorrow.
            </p>
          </div>
          <FooterCol title="Studio" links={["Philosophy", "Services", "Work", "Journal"]} />
          <FooterCol title="Company" links={["About", "Careers", "Press", "Contact"]} />
          <FooterCol title="Social" links={["Instagram", "LinkedIn", "X / Twitter", "Behance"]} />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Arroww Productions. All rights reserved.</span>
          <span>Designed &amp; built in-house.</span>
        </div>

        <div className="big-mark mt-16 select-none text-center text-[clamp(4rem,22vw,22rem)] font-semibold tracking-[-0.06em] leading-[0.85] bg-gradient-to-b from-foreground/90 to-foreground/10 bg-clip-text text-transparent">
          arroww→
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="text-sm hover:text-foreground/100 text-foreground/70 transition-colors">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
