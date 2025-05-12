
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Bitcoin, Wallet, ChevronsUpDown, ChevronRight, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Payment network icons
const PaymentIcons = {
  Ethereum: () => (
    <svg className="h-4 w-4" viewBox="0 0 256 417" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
      <path fill="#343434" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"/>
      <path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.639V154.158z"/>
      <path fill="#3C3C3B" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"/>
      <path fill="#8C8C8C" d="M127.962 416.905v-104.72L0 236.585z"/>
      <path fill="#141414" d="M127.961 287.958l127.96-75.637-127.96-58.162z"/>
      <path fill="#393939" d="M0 212.32l127.96 75.638v-133.8z"/>
    </svg>
  ),
  Solana: () => (
    <svg className="h-4 w-4" width="22" height="22" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
      <path d="M93.94 42.63H13.78c-1.75 0-2.66 2.24-1.44 3.59l11.46 12.01a2.56 2.56 0 0 0 1.86.76h80.16c1.75 0 2.66-2.24 1.44-3.59L95.8 43.39a2.56 2.56 0 0 0-1.86-.76z" fill="#9945FF"/>
      <path d="M93.94 69.45H13.78c-1.75 0-2.66 2.24-1.44 3.59l11.46 12.01a2.56 2.56 0 0 0 1.86.76h80.16c1.75 0 2.66-2.24 1.44-3.59L95.8 70.21a2.56 2.56 0 0 0-1.86-.76z" fill="#9945FF"/>
      <path d="M13.78 56.04h80.16c1.75 0 2.66-2.24 1.44-3.59L83.92 40.44a2.56 2.56 0 0 0-1.86-.76H1.9c-1.75 0-2.66 2.24-1.44 3.59l11.46 12.01a2.56 2.56 0 0 0 1.86.76z" fill="#9945FF"/>
    </svg>
  ),
  Bitcoin: () => <Bitcoin className="h-4 w-4" />,
  Base: () => (
    <svg className="h-4 w-4" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 0C9.85 0 0 9.85 0 22s9.85 22 22 22 22-9.85 22-22S34.15 0 22 0z" fill="#0052FF"/>
      <path d="M22.2 33a11 11 0 1 0 0-22 11 11 0 0 0 0 22z" fill="white"/>
    </svg>
  )
};

const Checkout = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cryptoNetwork, setCryptoNetwork] = useState("ethereum");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Initialize react-hook-form
  const form = useForm({
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      zip: "",
      country: "us"
    }
  });

  const shippingForm = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      zip: "",
      country: "us"
    }
  });
  
  // Mock product data - in a real app, you'd fetch this based on productId
  const product = {
    id: productId || "1",
    title: "Urban Dreams Tee",
    artist: "Clara Monteiro",
    price: 39.99,
    imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    size: "M",
    quantity: 1
  };

  // Calculate summary
  const subtotal = product.price * product.quantity;
  const shipping = 5.99;
  const total = subtotal + shipping;

  // Artist and platform split calculation (60/40)
  const artistShare = total * 0.6;
  const platformShare = total * 0.4;

  // Crypto network options
  const cryptoNetworks = [
    { id: "ethereum", name: "Ethereum (ETH)", icon: <PaymentIcons.Ethereum /> },
    { id: "bitcoin", name: "Bitcoin (BTC)", icon: <PaymentIcons.Bitcoin /> },
    { id: "solana", name: "Solana (SOL)", icon: <PaymentIcons.Solana /> },
    { id: "base", name: "Base (ETH)", icon: <PaymentIcons.Base /> },
  ];

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Successful",
        description: `Your order has been processed via ${paymentMethod === 'card' ? 'credit card' : `${cryptoNetwork} network`}`,
        variant: "default",
      });
      navigate("/payment-success");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Order summary */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Checkout</h1>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Cart</span>
                  <ChevronRight className="h-4 w-4 mx-1" />
                  <span>Information</span>
                  <ChevronRight className="h-4 w-4 mx-1" />
                  <span className="font-medium text-foreground">Payment</span>
                </div>
              </div>

              <Card className="mb-8">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  <div className="flex items-center gap-4 pb-4 border-b">
                    <div className="w-16 h-16 rounded overflow-hidden">
                      <img 
                        src={product.imageUrl} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{product.title}</h3>
                      <p className="text-sm text-muted-foreground">By {product.artist}</p>
                      <p className="text-sm">Size: {product.size} • Qty: {product.quantity}</p>
                    </div>
                    <div className="font-medium">${product.price.toFixed(2)}</div>
                  </div>
                  
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-base pt-2 border-t">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <h3 className="font-semibold mb-2">Revenue Split</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>Artist ({product.artist})</span>
                        <span>${artistShare.toFixed(2)} (60%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Paisagem Platform</span>
                        <span>${platformShare.toFixed(2)} (40%)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  
                  <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="card" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Credit Card
                      </TabsTrigger>
                      <TabsTrigger value="crypto" className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        Cryptocurrency
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="card" className="mt-6">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(handlePayment)} className="grid gap-4">
                          <FormField
                            control={form.control}
                            name="cardName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cardholder Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Card Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="1234 5678 9012 3456" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="expiryDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Expiry Date</FormLabel>
                                  <FormControl>
                                    <Input placeholder="MM/YY" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="cvv"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CVV</FormLabel>
                                  <FormControl>
                                    <Input placeholder="123" type="password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </form>
                      </Form>
                    </TabsContent>
                    
                    <TabsContent value="crypto" className="mt-6">
                      <div className="space-y-4">
                        <div>
                          <FormLabel>Select Cryptocurrency Network</FormLabel>
                          <div className="relative mt-1">
                            <Select value={cryptoNetwork} onValueChange={setCryptoNetwork}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select network" />
                              </SelectTrigger>
                              <SelectContent>
                                {cryptoNetworks.map((network) => (
                                  <SelectItem key={network.id} value={network.id} className="flex items-center gap-2">
                                    <div className="flex items-center gap-2">
                                      {network.icon}
                                      <span>{network.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <FormLabel>Wallet Address</FormLabel>
                          <div className="relative">
                            <Input 
                              value="wallet connected"
                              readOnly
                              className="bg-muted"
                            />
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 text-xs"
                            >
                              Change
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-muted p-4 rounded-md">
                          <p className="text-sm">
                            You'll be prompted to approve this transaction in your connected wallet.
                            Payments are processed securely through Crossmint.
                          </p>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 p-4 rounded-md">
                          <h4 className="font-medium text-purple-800 mb-1">Supported Networks</h4>
                          <div className="flex flex-wrap gap-2">
                            {cryptoNetworks.map((network) => (
                              <div key={network.id} 
                                   className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs
                                              ${cryptoNetwork === network.id ? 
                                                'bg-purple-700 text-white' : 
                                                'bg-purple-100 text-purple-700'}`}>
                                {network.icon}
                                <span>{network.name.split(' ')[0]}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            {/* Right column - Payment and shipping info */}
            <div>
              <Card className="sticky top-8">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                  <Form {...shippingForm}>
                    <form onSubmit={shippingForm.handleSubmit(handlePayment)} className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={shippingForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={shippingForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={shippingForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={shippingForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={shippingForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="New York" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={shippingForm.control}
                          name="zip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code</FormLabel>
                              <FormControl>
                                <Input placeholder="10001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={shippingForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select 
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="us">United States</SelectItem>
                                <SelectItem value="br">Brazil</SelectItem>
                                <SelectItem value="ca">Canada</SelectItem>
                                <SelectItem value="uk">United Kingdom</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                  
                  <div className="mt-6 pt-4 border-t">
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 text-white" 
                      size="lg"
                      disabled={isProcessing}
                      onClick={handlePayment}
                    >
                      {isProcessing ? "Processing..." : (
                        <span className="flex items-center">
                          Pay ${total.toFixed(2)}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                    
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
