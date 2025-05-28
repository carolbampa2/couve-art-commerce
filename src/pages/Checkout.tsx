
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";
import OrderSummary from '@/components/checkout/OrderSummary';
import PaymentSection from '@/components/checkout/PaymentSection';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import { PaymentProvider } from '@/context/PaymentContext';
import { CrossmintProvider, CrossmintHostedCheckout } from '@crossmint/client-sdk-react-ui';

// Define the Staging Client API Key
const STAGING_CLIENT_API_KEY = "ck_staging_5TNx5swqCST7UE5jdjKze6SpyJAgdjjWPGXjpcEx8qayExyZzf21vuY7ZERbeHbArxm8fUn8yhedtTDn18zrJaGw8vmqN72t86tkWLm9fknnar21yuv4HtaNqT5eshgBxZhd1crdCrucPrHX98isJvzepwdQ5PQ2FrQMw4Kj6VH6gQDe77E5SJvWKr6DX6fr1QwMWDdtgLPSuRVtbadsZc3S";
const STAGING_COLLECTION_ID = "6387aa45-f0bf-4923-a63c-2e13783a58dc";


const Checkout = () => {
  const { productId } = useParams();

  // Initialize react-hook-form
  const form = useForm({
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
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

  const lineItems = [
    {
      collectionLocator: `crossmint:${STAGING_COLLECTION_ID}`,
      callData: {
        totalPrice: String(product.price * product.quantity), // Assuming product.price is in a unit that doesn't need further conversion to smallest unit for now
        quantity: product.quantity,
        productId: product.id,
        customData: product.size || ""
      }
    }
  ];

  const paymentConfig = {
    crypto: { enabled: true },
    fiat: { enabled: true }
  };

  return (
    <PaymentProvider>
      <CrossmintProvider apiKey={STAGING_CLIENT_API_KEY}>
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

                  <OrderSummary product={product} />
                  
                  {/* Crossmint Hosted Checkout */}
                  <div className="my-8"> {/* Added some margin for spacing */}
                    <CrossmintHostedCheckout
                      lineItems={lineItems}
                      payment={paymentConfig}
                    />
                  </div>
                  
                  <PaymentSection form={form} />
                </div>
                
                {/* Right column - Payment and shipping info */}
              <div>
                <CheckoutSummary 
                  total={product.price * product.quantity + 5.99}
                  shippingForm={shippingForm}
                />
              </div>
            </div>
          </div>
        </main>
        <Footer />
        </div>
      </CrossmintProvider>
    </PaymentProvider>
  );
};

export default Checkout;
