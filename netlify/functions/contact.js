// Netlify serverless function: handles contact form submissions
// Validates all inputs server-side before forwarding to Netlify Forms
// This prevents spam bots from hitting the endpoint directly

export const handler = async (event) => {
  // Only accept POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // CORS guard — tighten to your actual domain in production
  const origin = event.headers.origin || "";
  const allowedOrigins = [
    "https://arrowwproductions.netlify.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ];
  if (!allowedOrigins.includes(origin)) {
    return { statusCode: 403, body: "Forbidden" };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const { name, email, company, project } = body;

  // ── Server-side validation ─────────────────────────────────────────
  const errors = [];

  // Name: required, 2–80 chars, no HTML
  if (!name || typeof name !== "string") {
    errors.push("Name is required.");
  } else {
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 80) {
      errors.push("Name must be between 2 and 80 characters.");
    }
    if (/<[^>]*>/.test(trimmed)) {
      errors.push("Name must not contain HTML.");
    }
  }

  // Email: required, valid format, max 254 chars (RFC 5321)
  if (!email || typeof email !== "string") {
    errors.push("Email is required.");
  } else {
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(trimmed) || trimmed.length > 254) {
      errors.push("A valid email address is required.");
    }
  }

  // Company: optional but max 100 chars if provided
  if (company && typeof company === "string" && company.trim().length > 100) {
    errors.push("Company name must be under 100 characters.");
  }

  // Project: required, 10–2000 chars
  if (!project || typeof project !== "string") {
    errors.push("Project description is required.");
  } else {
    const trimmed = project.trim();
    if (trimmed.length < 10) {
      errors.push("Please describe your project in at least 10 characters.");
    }
    if (trimmed.length > 2000) {
      errors.push("Project description must be under 2000 characters.");
    }
    if (/<script[\s\S]*?>[\s\S]*?<\/script>/gi.test(trimmed)) {
      errors.push("Project description contains disallowed content.");
    }
  }

  if (errors.length > 0) {
    return {
      statusCode: 422,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ errors }),
    };
  }

  // ── Rate-limiting note ─────────────────────────────────────────────
  // Netlify Forms has built-in spam protection via Akismet + honeypot.
  // For extra rate limiting, add a KV store or use Netlify Edge Middleware.

  // ── Submit to Netlify Forms ────────────────────────────────────────
  try {
    const formData = new URLSearchParams({
      "form-name": "contact",
      name: name.trim(),
      email: email.trim(),
      company: (company || "").trim(),
      project: project.trim(),
    });

    const response = await fetch("https://arrowwproductions.netlify.app/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`Netlify Forms returned ${response.status}`);
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("Form submission error:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Submission failed. Please try emailing us directly." }),
    };
  }
};
