
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowUpRight } from "lucide-react";

const TokenSection = () => {
  const benefits = [
    "Access to exclusive product releases",
    "Special edition artist collaborations",
    "Priority shipping on all orders",
    "Early access to new collections",
    "Community voting rights on future artists",
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Unlock Exclusive Benefits with <span className="gradient-text">COUVE Token</span>
            </h2>
            <p className="text-muted-foreground mb-6 text-lg">
              COUVE is a utility token on the Solana blockchain that grants holders access to 
              exclusive products and special benefits within the Paisagem ecosystem.
            </p>
            
            <ul className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-paisagem-teal mr-2 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="gradient-bg" size="lg">
                Get COUVE Tokens
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">Learn More</Button>
            </div>
          </div>
          
          <div className="lg:ml-auto">
            <Card className="overflow-hidden border-2 border-paisagem-purple/20">
              <div className="p-1 gradient-bg">
                <div className="bg-card p-4 rounded-sm">
                  <h3 className="font-bold text-xl mb-4 text-center">COUVE Token Details</h3>
                  
                  <CardContent className="p-0 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted rounded-md">
                        <p className="text-muted-foreground text-sm mb-1">Network</p>
                        <p className="font-bold">Solana</p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-md">
                        <p className="text-muted-foreground text-sm mb-1">Token Type</p>
                        <p className="font-bold">SPL</p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-md">
                        <p className="text-muted-foreground text-sm mb-1">Min. Required</p>
                        <p className="font-bold">100 COUVE</p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-md">
                        <p className="text-muted-foreground text-sm mb-1">Total Supply</p>
                        <p className="font-bold">10,000,000</p>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-md mt-4">
                      <p className="text-center text-sm">
                        Token Address: <span className="font-mono text-xs">COUVE...</span>
                      </p>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TokenSection;
