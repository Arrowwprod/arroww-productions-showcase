import { createFileRoute } from "@tanstack/react-router";
import { useLenis } from "@/hooks/use-lenis";
import { Dock } from "@/components/landing/Dock";
import { Hero } from "@/components/landing/Hero";
import { Marquee } from "@/components/landing/Marquee";
import { Philosophy } from "@/components/landing/Philosophy";
import { Services } from "@/components/landing/Services";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arroww Productions — Media & Marketing Studio" },
      {
        name: "description",
        content:
          "Arroww Productions is a media & marketing studio crafting cinematic brands, growth engines, and digital products for ambitious teams.",
      },
      { property: "og:title", content: "Arroww Productions — Media & Marketing Studio" },
      {
        property: "og:description",
        content:
          "Branding, marketing, web, PR, content and automation — directed end-to-end by one studio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useLenis();
  return (
    <main className="relative bg-background text-foreground">
      <Dock />
      <Hero />
      <Marquee />
      <Philosophy />
      <Services />
      <Contact />
      <Footer />
    </main>
  );
}
