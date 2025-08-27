// src/pages/Checkout.tsx (v125 - Headless with Stripe Element)
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";
import OrderSummary from '@/components/checkout/OrderSummary';
import CheckoutSummary from '@/components/checkout/CheckoutSummary'; // Will need modification or a new prop for submission
import { supabase } from '@/integrations/supabase/client';

import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button'; // Assuming a generic Button component

// StripeForm component to encapsulate Stripe Elements logic
const StripePaymentForm = ({ clientSecret, crossmintOrderId, product }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      console.error("Stripe.js has not yet loaded.");
      setErrorMessage("Payment system is not ready. Please wait a moment and try again.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const return_url = `${window.location.origin}/payment-status?crossmint_order_id=${crossmintOrderId}&product_id=${product.id}&status=success`;
    // const error_return_url = `${window.location.origin}/payment-status?crossmint_order_id=${crossmintOrderId}&product_id=${product.id}&status=error`;


    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: return_url,
      },
      // redirect: "if_required", // Default is "if_required"
    });

    if (error) {
      console.error("Stripe payment confirmation error:", error);
      setErrorMessage(error.message || "An unexpected error occurred during payment.");
      setIsProcessing(false); // Only stop processing if there's an immediate client-side error
    } else {
      // If redirect: "if_required" is used and no immediate error, a redirect to return_url is expected
      // or payment was completed without redirect.
      console.log("Stripe payment submitted. User may be redirected or success handled on return_url.");
      // UI might show a generic "processing" or success message if no redirect.
      // setPaymentSuccess(true); // This might be premature if a redirect is happening.
    }
  };

  if (paymentSuccess) { // This state might be better handled on the return_url page
    return <div className="text-green-600 p-4 border border-green-300 rounded-md">Payment processing initiated! Please await confirmation.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 border rounded-lg shadow-md">
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <Button type="submit" disabled={!stripe || isProcessing || paymentSuccess} className="w-full">
        {isProcessing ? "Processing Payment..." : "Pay Now"}
      </Button>
      {errorMessage && <p className="text-red-500 text-sm text-center mt-2">{errorMessage}</p>}
    </form>
  );
};


const Checkout = () => {
  console.log("[Checkout v125-HEADLESS] Main Checkout component RENDERED.");
  const { productId: routeProductId } = useParams();

  const shippingFormMethods = useForm({
    defaultValues: {
      firstName: "", lastName: "", email: "", address: "",
      city: "", state: "", zip: "", country: "US"
    }
  });
  
  const product = {
    id: routeProductId || "test-headless-product-001",
    title: "Urban Dreams Tee (Headless Test)",
    price: 1.00,
    imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto.format&fit=crop&w=300&q=80",
    size: "M",
    quantity: 1,
    artist: "Test Artist"
  };

  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [stripePublishableKey, setStripePublishableKey] = useState<string | null>(null);
  const [crossmintOrderIdForStripe, setCrossmintOrderIdForStripe] = useState<string | null>(null);
  const [isLoadingPaymentSetup, setIsLoadingPaymentSetup] = useState(false);
  const [paymentSetupError, setPaymentSetupError] = useState<string | null>(null);

  const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

  const handleProceedToPayment = async (shippingData) => {
    setIsLoadingPaymentSetup(true);
    setPaymentSetupError(null);
    setStripeClientSecret(null);

    const orderPayload = {
      shippingAddress: {
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        address1: shippingData.address,
        city: shippingData.city,
        state: shippingData.state || "",
        zip: shippingData.zip,
        country: shippingData.country,
      },
      email: shippingData.email,
      productId: product.id,
      quantity: product.quantity,
      customData: product.size || "",
      displayPrice: String(product.price.toFixed(2))
    };

    console.log("[Checkout v125-HEADLESS] Calling create-crossmint-headless-checkout with payload:", orderPayload);

    try {
      const { data, error } = await supabase.functions.invoke('create-crossmint-headless-checkout', {
        body: orderPayload,
      });

      if (error) throw error;

      if (data && data.stripeClientSecret && data.stripePublishableKey && data.crossmintOrderId) {
        console.log("[Checkout v125-HEADLESS] Received Stripe details:", data);
        setStripePublishableKey(data.stripePublishableKey);
        setStripeClientSecret(data.stripeClientSecret);
        setCrossmintOrderIdForStripe(data.crossmintOrderId);
      } else {
        throw new Error("Required Stripe details not received from backend.");
      }
    } catch (err) {
      console.error("[Checkout v125-HEADLESS] Error calling create-crossmint-headless-checkout:", err);
      setPaymentSetupError(err.message || "Failed to set up payment.");
    } finally {
      setIsLoadingPaymentSetup(false);
    }
  };

  return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold tracking-tight mb-2">Checkout</h1>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>Cart</span> <ChevronRight className="h-4 w-4 mx-1" />
                    <span>Information</span> <ChevronRight className="h-4 w-4 mx-1" />
                    <span className="font-medium text-foreground">Payment</span>
                  </div>
                </div>
                <OrderSummary product={product} />

                {stripeClientSecret && stripePromise && crossmintOrderIdForStripe ? (
                  <div className="my-8">
                    <h2 className="text-xl font-semibold mb-4">Enter Payment Details</h2>
                    <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret } as StripeElementsOptions}>
                      <StripePaymentForm clientSecret={stripeClientSecret} crossmintOrderId={crossmintOrderIdForStripe} product={product} />
                    </Elements>
                  </div>
                ) : (
                  <div className="my-8">
                     {/* Shipping form is rendered by CheckoutSummary in the right column */}
                     {/* This section is for before Stripe is initialized */}
                     <h2 className="text-xl font-semibold mb-4">Confirm Shipping & Proceed</h2>
                     <p className="text-sm text-gray-600 mb-4">Please review your shipping details on the right. Click below to proceed to payment.</p>
                     {/* The actual submit button for shippingForm is now part of CheckoutSummary or handled by onProceedToPayment prop */}
                  </div>
                )}
                {isLoadingPaymentSetup && <p className="text-center py-4">Setting up payment, please wait...</p>}
                {paymentSetupError && <p className="text-red-500 text-center py-4">Error: {paymentSetupError}</p>}
              </div>

              <div className="lg:col-span-1">
                <FormProvider {...shippingFormMethods}>
                  <CheckoutSummary
                    total={product.price * product.quantity + 5.99}
                    onProceedToPayment={shippingFormMethods.handleSubmit(handleProceedToPayment)}
                    isLoading={isLoadingPaymentSetup}
                    isPaymentReady={!!stripeClientSecret} // New prop to control button visibility/state
                  />
                </FormProvider>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
  );
};

export default Checkout;
