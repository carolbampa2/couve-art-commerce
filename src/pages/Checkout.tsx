
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

  return (
    <PaymentProvider>
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
    </PaymentProvider>
  );
};

export default Checkout;
