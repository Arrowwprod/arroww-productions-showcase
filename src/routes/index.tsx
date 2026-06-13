import { createFileRoute } from "@tanstack/react-router";
import { useLenis } from "@/hooks/use-lenis";
import { Dock } from "@/components/landing/Dock";
import { Hero } from "@/components/landing/Hero";
import { VideoCanvas } from "@/components/landing/VideoCanvas";
import { Philosophy } from "@/components/landing/Philosophy";
import { Services } from "@/components/landing/Services";
import { Workflow } from "@/components/landing/Workflow";
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
    <main style={{ position: "relative", minHeight: "100vh", background: "transparent", color: "#f8f8f8" }}>
      <VideoCanvas />
      {/* All sections sit above the fixed canvas */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Dock />
        <Hero />
        <Philosophy />
        <Services />
        <Workflow />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
