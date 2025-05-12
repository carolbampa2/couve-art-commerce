
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, ArrowUpRight, Lock, Coins, Shield, Zap } from "lucide-react";

const Token = () => {
  const benefits = [
    "Access to exclusive product releases",
    "Special edition artist collaborations",
    "Priority shipping on all orders",
    "Early access to new collections",
    "Community voting rights on future artists",
    "Discounts on regular products",
  ];

  const tokenDistribution = [
    { label: "Community", percentage: 40 },
    { label: "Artists", percentage: 30 },
    { label: "Team", percentage: 15 },
    { label: "Development", percentage: 10 },
    { label: "Marketing", percentage: 5 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-background to-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                  Introducing <span className="gradient-text">COUVE Token</span>
                </h1>
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
                  <Button variant="outline" size="lg">View on Explorer</Button>
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

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight mb-2">COUVE Token Features</h2>
              <p className="text-muted-foreground max-w-[700px] mx-auto">
                How COUVE powers the Paisagem ecosystem and benefits both artists and collectors
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="card-hover">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-paisagem-purple to-paisagem-teal flex items-center justify-center mb-4">
                      <Lock className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Exclusive Access</h3>
                    <p className="text-muted-foreground">
                      Unlock special edition products and collaborations only available to COUVE holders.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-paisagem-purple to-paisagem-teal flex items-center justify-center mb-4">
                      <Coins className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Revenue Sharing</h3>
                    <p className="text-muted-foreground">
                      Artists receive 60% of sales revenue, with transparent distribution through smart contracts.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-paisagem-purple to-paisagem-teal flex items-center justify-center mb-4">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Governance Rights</h3>
                    <p className="text-muted-foreground">
                      Participate in platform decisions including new artist onboarding and feature development.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Token Economics */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Token Economics</h2>
              <p className="text-muted-foreground max-w-[700px] mx-auto">
                Understanding the COUVE token distribution and utility within the ecosystem
              </p>
            </div>
            
            <Tabs defaultValue="distribution" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="distribution">Distribution</TabsTrigger>
                <TabsTrigger value="utility">Utility</TabsTrigger>
              </TabsList>
              <TabsContent value="distribution" className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Token Allocation</h3>
                    <div className="space-y-4">
                      {tokenDistribution.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span>{item.label}</span>
                            <span className="font-medium">{item.percentage}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div 
                              className="h-full rounded-full gradient-bg" 
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-semibold mb-4">Release Schedule</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b">
                          <span>Initial Distribution</span>
                          <span className="font-medium">40%</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b">
                          <span>Year 1</span>
                          <span className="font-medium">20%</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b">
                          <span>Year 2</span>
                          <span className="font-medium">20%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Year 3</span>
                          <span className="font-medium">20%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="utility" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-paisagem-purple to-paisagem-teal flex items-center justify-center mb-4">
                          <Lock className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="font-medium mb-2">Access Control</h4>
                        <p className="text-sm text-muted-foreground">
                          Minimum 100 COUVE tokens required for exclusive product access.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-paisagem-purple to-paisagem-teal flex items-center justify-center mb-4">
                          <Zap className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="font-medium mb-2">Discounts</h4>
                        <p className="text-sm text-muted-foreground">
                          Holding more tokens provides increasing discounts on all purchases.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-paisagem-purple to-paisagem-teal flex items-center justify-center mb-4">
                          <Shield className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="font-medium mb-2">Governance</h4>
                        <p className="text-sm text-muted-foreground">
                          Voting rights proportional to token holdings for platform decisions.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Join the Paisagem Community?</h2>
            <p className="text-muted-foreground max-w-[700px] mx-auto mb-8">
              Get COUVE tokens today and unlock exclusive access to limited edition designs from our talented artists.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="gradient-bg" size="lg">
                Buy COUVE Tokens
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Token;
