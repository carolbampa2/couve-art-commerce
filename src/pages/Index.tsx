
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import FeaturedArtists from "@/components/FeaturedArtists";
import TokenSection from "@/components/TokenSection";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedProducts />
        <HowItWorks />
        <FeaturedArtists />
        <section className="py-10 bg-muted">
          <div className="container text-center">
            <h2 className="text-2xl font-bold mb-4">{t("Are you an artist?")}</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              {t("Join our community of artists and sell your designs on the Paisagem platform.")}
            </p>
            <Button asChild className="gradient-bg">
              <Link to="/artist-signup">{t("Sign up as an Artist")}</Link>
            </Button>
          </div>
        </section>
        <TokenSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
