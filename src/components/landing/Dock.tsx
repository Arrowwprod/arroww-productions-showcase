import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const items = [
  { label: "Home", href: "#hero" },
  { label: "Philosophy", href: "#philosophy" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export function Dock() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div
        className={`liquid-glass flex items-center gap-1 rounded-full pl-2 pr-2 py-2 transition-all duration-500 ${
          scrolled ? "scale-[0.96]" : "scale-100"
        }`}
      >
        <a
          href="#hero"
          className="flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-full hover:bg-foreground/5 transition-colors"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-foreground" />
          <span className="text-sm font-semibold tracking-tight">Arroww</span>
        </a>
        <div className="h-5 w-px bg-foreground/10 mx-1" />
        <ul className="flex items-center gap-0.5">
          {items.map((it) => (
            <li key={it.href}>
              <a
                href={it.href}
                className="text-sm px-3 py-1.5 rounded-full text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="ml-1 text-sm font-medium px-4 py-1.5 rounded-full bg-foreground text-background hover:opacity-90 transition-opacity"
        >
          Let's talk
        </a>
      </div>
    </motion.nav>
  );
}
