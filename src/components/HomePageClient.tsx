import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Differences from "@/components/sections/Differences";
import Pricing from "@/components/sections/Pricing";
import Animals from "@/components/sections/Animals";
import VisitFlow from "@/components/sections/VisitFlow";
import AnimalRules from "@/components/sections/AnimalRules";
import Gallery from "@/components/sections/Gallery";
import Reviews from "@/components/sections/Reviews";
import Contacts from "@/components/sections/Contacts";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/Footer";
import LazySectionBackgrounds from "@/components/LazySectionBackgrounds";

export default function HomePageClient() {
  return (
    <main>
      <LazySectionBackgrounds />
      <Navbar />
      <Hero />
      <About />
      <Differences />
      <Pricing />
      <Animals />
      <VisitFlow />
      <AnimalRules />
      <Gallery />
      <Reviews />
      <Contacts />
      <FAQ />
      <Footer />
    </main>
  );
}
