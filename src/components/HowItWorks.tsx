
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, ShoppingBag, Truck, Lock } from "lucide-react";

interface Step {
  icon: JSX.Element;
  title: string;
  description: string;
}

const HowItWorks = () => {
  const steps: Step[] = [
    {
      icon: <Wallet className="h-10 w-10 text-paisagem-purple" />,
      title: "Connect Your Wallet",
      description: "Link your Solana wallet to verify your COUVE token balance and enable crypto payments."
    },
    {
      icon: <ShoppingBag className="h-10 w-10 text-paisagem-purple" />,
      title: "Choose Your Art",
      description: "Browse our collection and select from regular items or exclusive COUVE-gated products."
    },
    {
      icon: <Lock className="h-10 w-10 text-paisagem-teal" />,
      title: "Access Exclusives",
      description: "Hold at least 100 COUVE tokens to unlock exclusive designs and limited editions."
    },
    {
      icon: <Truck className="h-10 w-10 text-paisagem-teal" />,
      title: "Receive Your Order",
      description: "We'll print and ship your custom t-shirt directly to you through our Printful integration."
    },
  ];

  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-2">How It Works</h2>
          <p className="text-muted-foreground max-w-[700px]">
            Our Web3-powered platform makes buying custom art simple, whether you're new to crypto or an experienced collector.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-muted p-3 mb-5">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
                <div className="mt-4 text-2xl font-bold text-paisagem-purple opacity-20">
                  {index + 1}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
