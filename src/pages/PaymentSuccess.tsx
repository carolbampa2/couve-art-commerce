
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";

const PaymentSuccess = () => {
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  
  useEffect(() => {
    // Simulate sending the order to the blockchain for revenue splitting
    console.log("Processing order on blockchain for revenue split (60% artist, 40% platform)");
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="container px-4 md:px-6 max-w-3xl">
          <Card className="border-2 border-green-500">
            <CardContent className="pt-6 pb-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold tracking-tight mb-2">Payment Successful!</h1>
              <p className="text-muted-foreground mb-6">
                Thank you for your purchase. Your order has been successfully placed.
              </p>
              
              <div className="bg-muted p-4 rounded-md mb-6 text-left">
                <p className="font-medium">Order Number: <span className="font-mono">{orderNumber}</span></p>
                <p className="text-sm text-muted-foreground mt-1">
                  A confirmation email has been sent to your email address.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-8">
                <p className="text-sm text-green-800">
                  <strong>Transaction Complete:</strong> Revenue has been automatically split between the artist (60%) and the Paisagem platform (40%).
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link to="/shop" className="flex items-center">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/" className="flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                    Return Home
                  </Link>
                </Button>
              </div>

              <div className="mt-8 pt-4 border-t text-sm text-muted-foreground">
                <p>Having issues with your order? <Link to="/contact" className="text-paisagem-purple hover:underline">Contact Support</Link></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
