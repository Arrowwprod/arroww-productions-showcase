import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".c-line", {
        yPercent: 110,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      gsap.from(".c-form", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        delay: 0.2,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={root}
      className="relative py-32 sm:py-48 px-6 bg-foreground text-background overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div className="relative mx-auto max-w-6xl grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <div className="flex items-center gap-3 mb-8 text-sm text-background/60">
            <span className="h-px w-10 bg-background/40" />
            <span className="uppercase tracking-[0.2em] text-xs">Contact sales</span>
          </div>
          <h2 className="text-[clamp(2.25rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.035em]">
            <span className="block overflow-hidden"><span className="c-line inline-block">Let's build</span></span>
            <span className="block overflow-hidden"><span className="c-line inline-block">something</span></span>
            <span className="block overflow-hidden"><span className="c-line inline-block text-background/50">unforgettable.</span></span>
          </h2>
          <div className="mt-10 space-y-2 text-background/70">
            <a href="mailto:hello@arroww.studio" className="block text-lg hover:text-background transition-colors">
              hello@arroww.studio
            </a>
            <p className="text-sm">Response within 24 hours · Mon–Fri</p>
          </div>
        </div>

        <form
          className="c-form liquid-glass-strong rounded-3xl p-6 sm:p-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" name="name" placeholder="Your name" />
            <Field label="Email" name="email" type="email" placeholder="you@company.com" />
          </div>
          <Field label="Company" name="company" placeholder="Where you work" />
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-background/60">
              Project
            </label>
            <textarea
              required
              rows={4}
              placeholder="Tell us what you're building…"
              className="mt-2 w-full rounded-xl bg-background/5 border border-background/15 px-4 py-3 text-background placeholder:text-background/40 focus:outline-none focus:border-background/40 transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitted}
            className="w-full rounded-full bg-background text-foreground py-3.5 font-medium hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:opacity-70"
          >
            {submitted ? "Thanks — we'll be in touch ✓" : "Send inquiry →"}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({
  label, name, type = "text", placeholder,
}: { label: string; name: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={name} className="text-xs uppercase tracking-[0.15em] text-background/60">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl bg-background/5 border border-background/15 px-4 py-3 text-background placeholder:text-background/40 focus:outline-none focus:border-background/40 transition-colors"
      />
    </div>
  );
}
