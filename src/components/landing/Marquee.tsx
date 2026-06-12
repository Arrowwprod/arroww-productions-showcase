const words = [
  "Branding",
  "Marketing",
  "Graphic Design",
  "PR",
  "Web Development",
  "Digital Identity",
  "Automation",
  "Social",
  "Content",
  "Growth",
];

export function Marquee() {
  const row = [...words, ...words];
  return (
    <section className="relative py-10 border-y border-foreground/10 overflow-hidden">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {row.map((w, i) => (
          <span
            key={i}
            className="flex items-center gap-12 text-2xl sm:text-4xl font-medium tracking-tight text-foreground/80"
          >
            {w}
            <span className="text-foreground/30">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
