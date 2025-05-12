
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import FeaturedArtists from "@/components/FeaturedArtists";
import TokenSection from "@/components/TokenSection";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedProducts />
        <HowItWorks />
        <FeaturedArtists />
        <TokenSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
