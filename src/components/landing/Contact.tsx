import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Sanitize: strip HTML tags from user input to prevent XSS display
function sanitize(str: string) {
  return str.replace(/<[^>]*>/g, "").trim();
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  maxLength,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label
        htmlFor={name}
        style={{
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)",
          fontWeight: 600,
        }}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={type === "email" ? "email" : "off"}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${focused ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)"}`,
          borderRadius: "0.75rem",
          padding: "13px 16px",
          color: "#fff",
          fontSize: 16, // Prevents iOS zoom
          outline: "none",
          transition: "border-color 0.25s",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [project, setProject] = useState("");
  const [taFocused, setTaFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Submission states
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = formRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".c-line", {
        yPercent: 115,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.09,
        scrollTrigger: { trigger: root.current, start: "top 72%" },
      });
      gsap.from(".c-form", {
        y: 50,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        delay: 0.15,
        scrollTrigger: { trigger: root.current, start: "top 72%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // Client-side validation before submit
  const validate = (): string | null => {
    if (!name.trim() || name.trim().length < 2) return "Please enter your name.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))
      return "Please enter a valid email address.";
    if (!project.trim() || project.trim().length < 10)
      return "Please describe your project (at least 10 characters).";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check — if bot-trap field is filled, silently succeed
    const honeypot = (formRef.current?.querySelector("[name=_gotcha]") as HTMLInputElement)?.value;
    if (honeypot) {
      setStatus("success");
      return;
    }

    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }
    setErrorMsg("");
    setStatus("submitting");

    try {
      // Submit to Netlify Forms via serverless function for server-side validation
      const res = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: sanitize(name),
          email: email.trim(),
          company: sanitize(company),
          project: sanitize(project),
        }),
      });

      if (res.ok) {
        setStatus("success");
        setName(""); setEmail(""); setCompany(""); setProject("");
      } else {
        const data = await res.json().catch(() => ({}));
        const msg = data?.errors?.[0] || data?.error || "Something went wrong. Please try again.";
        setErrorMsg(msg);
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  const isSubmitted = status === "success";
  const isSubmitting = status === "submitting";

  return (
    <section
      id="contact"
      ref={root}
      style={{
        position: "relative",
        padding: isMobile ? "7rem 1.5rem 6rem" : "10rem 2rem",
        overflow: "hidden",
        color: "#fff",
      }}
    >
      {/* Divider */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: isMobile ? "1.5rem" : "2rem",
          right: isMobile ? "1.5rem" : "2rem",
          height: 1,
          background: "rgba(255,255,255,0.06)",
        }}
      />

      <div
        style={{
          margin: "0 auto",
          maxWidth: 1400,
          display: "grid",
          gap: isMobile ? "3rem" : "5rem",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          alignItems: "start",
        }}
      >
        {/* Left — CTA copy */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2rem" }}>
            <span style={{ width: 32, height: 1, background: "rgba(255,255,255,0.25)", display: "inline-block" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
              Contact sales
            </span>
          </div>

          <h2
            style={{
              fontSize: isMobile ? "clamp(2.2rem,10vw,3.5rem)" : "clamp(2.8rem,7vw,6.5rem)",
              fontWeight: 600,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              margin: "0 0 2.5rem",
            }}
          >
            <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.25em", marginBottom: "-0.25em" }}>
              <span className="c-line" style={{ display: "inline-block", paddingBottom: "0.25em" }}>Let's build</span>
            </span>
            <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.25em", marginBottom: "-0.25em" }}>
              <span className="c-line" style={{ display: "inline-block", paddingBottom: "0.25em" }}>something</span>
            </span>
            <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.25em", marginBottom: "-0.25em" }}>
              <span className="c-line" style={{ display: "inline-block", color: "#fff", paddingBottom: "0.25em" }}>unforgettable.</span>
            </span>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <a
              href="mailto:growitharroww@gmail.com"
              style={{
                fontSize: isMobile ? "clamp(0.9rem,3.5vw,1.1rem)" : "clamp(1rem,1.5vw,1.25rem)",
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                paddingBottom: "1.5rem",
                transition: "color 0.2s",
                display: "block",
                wordBreak: "break-all",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
            >
              growitharroww@gmail.com ↗
            </a>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 1.6, margin: 0 }}>
              Response within 24 hours · Mon–Fri<br />
              Based globally, available everywhere.
            </p>
          </div>
        </div>

        {/* Right — Form */}
        <form
          ref={formRef}
          className="c-form"
          // Netlify Forms detection attributes (required for Netlify to pick up the form during build)
          name="contact"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="_gotcha"
          onSubmit={handleSubmit}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onMouseMove={handleMouseMove}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            padding: isMobile ? "1.75rem 1.25rem" : "2.5rem",
            borderRadius: "2rem",
            position: "relative",
            overflow: "hidden",
            boxSizing: "border-box",
            background: hovered
              ? "linear-gradient(160deg, rgba(255, 255, 255, 0.085) 0%, rgba(255, 255, 255, 0.04) 100%)"
              : "linear-gradient(160deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.005) 100%)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: hovered ? "1px solid rgba(255, 255, 255, 0.18)" : "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: hovered
              ? "inset 0 1.5px 0 rgba(255, 255, 255, 0.16), 0 16px 40px rgba(0, 0, 0, 0.45)"
              : "inset 0 1.5px 0 rgba(255, 255, 255, 0.12), 0 8px 30px rgba(0, 0, 0, 0.3)",
            transition: "background 0.35s ease, border-color 0.3s ease, box-shadow 0.35s ease",
          }}
        >
          {/* Glow border beam */}
          <div
            aria-hidden="true"
            style={{
              pointerEvents: "none",
              position: "absolute",
              inset: 0,
              borderRadius: "2rem",
              background: `radial-gradient(180px circle at var(--x, 0px) var(--y, 0px), rgba(255, 255, 255, 0.28), transparent 75%)`,
              WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              padding: 1.5,
              boxSizing: "border-box",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.35s ease",
            }}
          />

          {/* Hidden Netlify form-name field (required) */}
          <input type="hidden" name="form-name" value="contact" />

          {/* Honeypot anti-spam trap — visually hidden from humans */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
            <label>
              Don't fill this out if you're human:
              <input name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {/* Fields */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "1rem",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Field label="Name" name="name" placeholder="Your name" maxLength={80} value={name} onChange={setName} />
            <Field label="Email" name="email" type="email" placeholder="you@company.com" maxLength={254} value={email} onChange={setEmail} />
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <Field label="Company" name="company" placeholder="Where you work" maxLength={100} value={company} onChange={setCompany} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, position: "relative", zIndex: 1 }}>
            <label
              htmlFor="project"
              style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontWeight: 600 }}
            >
              Project
            </label>
            <textarea
              id="project"
              name="project"
              required
              rows={4}
              maxLength={2000}
              placeholder="Tell us what you're building…"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              onFocus={() => setTaFocused(true)}
              onBlur={() => setTaFocused(false)}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${taFocused ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "0.75rem",
                padding: "13px 16px",
                color: "#fff",
                fontSize: 16, // Prevents iOS zoom
                outline: "none",
                resize: "none",
                fontFamily: "inherit",
                transition: "border-color 0.25s",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Validation / error message */}
          {(errorMsg || status === "error") && (
            <p
              role="alert"
              style={{
                fontSize: 13,
                color: "rgba(255, 120, 120, 0.9)",
                margin: 0,
                position: "relative",
                zIndex: 1,
              }}
            >
              {errorMsg || "Something went wrong. Please try again."}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitted || isSubmitting}
            aria-live="polite"
            style={{
              width: "100%",
              borderRadius: 999,
              background: isSubmitted ? "rgba(255,255,255,0.6)" : "#fff",
              color: "#000",
              padding: "15px",
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              cursor: isSubmitted || isSubmitting ? "default" : "pointer",
              letterSpacing: "-0.01em",
              transition: "transform 0.2s, opacity 0.2s",
              position: "relative",
              zIndex: 1,
              opacity: isSubmitting ? 0.7 : 1,
            }}
            onMouseEnter={(e) => { if (!isSubmitted && !isSubmitting) (e.currentTarget as HTMLElement).style.transform = "scale(1.01)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
          >
            {isSubmitted ? "Thanks — we'll be in touch ✓" : isSubmitting ? "Sending…" : "Send inquiry →"}
          </button>
        </form>
      </div>
    </section>
  );
}
