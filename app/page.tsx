import Equipe from "./components/Equipe/Equipe";
import Banner from "./components/ui/Banners/Banner";
import HeroSection from "./components/HeroSection/HeroSection";
import NosServices from "./components/NosServices/NosServices";
import Realisations from "./components/Realisations/Realisations";
import Testimoniales from "./components/Testimonials/Testimoniales";
import PostFinancement from "./components/PostFinancement/PostFinancement";
import BlogSection from "./components/Blog/BlogSection";
import JsonLd from "./components/JsonLd/JsonLd";
import { buildLocalBusinessSchema, buildBreadcrumbSchema } from "./lib/schemas";

export default function Home() {
  return (
    <main
      id="top"
      className="bg-(--bg) text-(--text) transition-colors duration-500"
    >
      <JsonLd schema={[
        buildLocalBusinessSchema(),
        buildBreadcrumbSchema([{ name: "Accueil", href: "/" }]),
      ]} />
      <HeroSection />
      <NosServices />
      <Banner />
      <Equipe />
      <Realisations />
      <PostFinancement />
      <BlogSection />
      <Testimoniales />
    </main>
  );
}
