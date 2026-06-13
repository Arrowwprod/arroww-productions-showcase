import { useState, useEffect } from "react";
import logoImg from "../../arww_logo.png";

const cols = [
  { title: "Studio", links: [{ label: "Philosophy", href: "#philosophy" }, { label: "Services", href: "#services" }, { label: "Work", href: "#" }, { label: "Journal", href: "#" }] },
  { title: "Company", links: [{ label: "About", href: "#" }, { label: "Careers", href: "#" }, { label: "Press", href: "#" }, { label: "Contact", href: "#contact" }] },
  { title: "Social", links: [{ label: "Instagram", href: "#" }, { label: "LinkedIn", href: "#" }, { label: "X / Twitter", href: "#" }, { label: "Behance", href: "#" }] },
];

export function Footer() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <footer style={{ position: "relative", padding: isMobile ? "4rem 1.5rem 2.5rem" : "6rem 2rem 3rem", overflow: "hidden" }}>
      {/* Top divider */}
      <div style={{ position: "absolute", top: 0, left: isMobile ? "1.5rem" : "2rem", right: isMobile ? "1.5rem" : "2rem", height: 1, background: "rgba(255,255,255,0.07)" }} />

      <div style={{ margin: "0 auto", maxWidth: 1400 }}>
        {/* Main grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.6fr 1fr 1fr 1fr",
          gap: isMobile ? "2.5rem" : "3rem",
          paddingBottom: isMobile ? "2.5rem" : "4rem",
          borderBottom: "1px solid rgba(255,255,255,0.07)"
        }}>
          {/* Brand col */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
              <img
                src={logoImg}
                alt="Arroww"
                style={{ height: 20, width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.85 }}
              />
              <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)", letterSpacing: "-0.02em" }}>Arroww Productions</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 1.7, margin: "0 0 2rem", maxWidth: 260 }}>
              A media &amp; marketing studio directing the brands of tomorrow.
            </p>
            {/* Social icons row */}
            <div style={{ display: "flex", gap: 10 }}>
              {["IG", "LI", "X", "Be"].map((s) => (
                <a
                  key={s}
                  href="#"
                  style={{
                    width: 34, height: 34, borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)",
                    textDecoration: "none", letterSpacing: "0.05em",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.25)"; el.style.color = "rgba(255,255,255,0.8)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.08)"; el.style.color = "rgba(255,255,255,0.35)"; }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Nav cols — 2 columns on mobile, individual on desktop */}
          {isMobile ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              {cols.map((col) => (
                <div key={col.title}>
                  <h4 style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "1.25rem", fontWeight: 600 }}>
                    {col.title}
                  </h4>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          style={{ fontSize: 13.5, color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 0.2s" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}
                        >
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            cols.map((col) => (
              <div key={col.title}>
                <h4 style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "1.25rem", fontWeight: 600 }}>
                  {col.title}
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        style={{ fontSize: 13.5, color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        {/* Bottom bar */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", paddingTop: "2rem", gap: "0.75rem" }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.22)" }}>
            © {new Date().getFullYear()} Arroww Productions. All rights reserved.
          </span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.22)" }}>
            Designed &amp; directed in-house.
          </span>
        </div>
      </div>
    </footer>
  );
}
