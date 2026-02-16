import Equipe from "./components/Equipe/Equipe";
import Banner from "./components/ui/Banners/Banner";
import HeroSection from "./components/HeroSection/HeroSection";
import NosServices from "./components/NosServices/NosServices";
import Realisations from "./components/Realisations/Realisations";
import Testimoniales from "./components/Testimonials/Testimoniales";
import PostFinancement from "./components/PostFinancement/PostFinancement";

export default function Home() {
  return (
    <main
      id="top"
      className="bg-(--bg) text-(--text) transition-colors duration-500"
    >
      <HeroSection />
      <NosServices />
      <Banner />
      <Equipe />
      <Realisations />
      <PostFinancement />
      <Testimoniales />
    </main>
  );
}
