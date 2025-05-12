
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                Where Art Meets <span className="gradient-text">Web3</span> Technology
              </h1>
              <p className="text-muted-foreground md:text-xl max-w-[600px]">
                Connecting graphic artists to a wider audience through blockchain innovation.
                Purchase exclusive designs and unlock special content with COUVE tokens.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button className="gradient-bg" size="lg">
                <Link to="/shop" className="flex items-center">
                  Explore Shop
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link to="/token" className="flex items-center">
                  Learn About COUVE
                </Link>
              </Button>
            </div>
          </div>
          <div className="mx-auto lg:mx-0 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-paisagem-purple/30 to-paisagem-teal/30 rounded-lg blur-3xl opacity-30"></div>
            <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-xl animate-float">
              <div className="aspect-[16/9] bg-gradient-to-br from-paisagem-darkPurple to-paisagem-teal p-2">
                <div className="w-full h-full bg-background/5 rounded-md flex items-center justify-center">
                  <p className="text-white text-xl md:text-2xl font-bold">Art Gallery Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
