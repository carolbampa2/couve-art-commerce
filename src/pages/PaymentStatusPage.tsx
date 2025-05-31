// src/pages/PaymentStatusPage.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from '@/components/ui/button'; // Assuming Button component

const PaymentStatusPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Processing your payment status...");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const crossmintOrderId = searchParams.get('crossmint_order_id');
  // const productId = searchParams.get('product_id'); // Product ID from URL
  const paymentStatus = searchParams.get('status'); // 'success' or 'error' or other Stripe statuses

  // Stripe specific query params (if needed)
  const payment_intent = searchParams.get('payment_intent');
  const payment_intent_client_secret = searchParams.get('payment_intent_client_secret');
  const redirect_status = searchParams.get('redirect_status');


  useEffect(() => {
    console.log("Payment Status Page Loaded - Query Params:", Object.fromEntries(searchParams.entries()));

    // Here you might want to make an API call to your backend to get the definitive order status
    // using crossmintOrderId or payment_intent, rather than just relying on query params from client.
    // For this example, we'll base it on the 'status' or 'redirect_status'.

    if (redirect_status === 'succeeded' || paymentStatus === 'success') {
      setMessage(`Payment for order ${crossmintOrderId || payment_intent || ''} was successful! Your order is being processed. You should receive a confirmation email shortly.`);
      setIsSuccess(true);
    } else if (redirect_status === 'failed' || paymentStatus === 'error') {
      setMessage(`There was an issue with your payment for order ${crossmintOrderId || payment_intent || ''}. Please try again or contact support if the problem persists.`);
      setIsSuccess(false);
    } else {
      setMessage(`Verifying payment status for order ${crossmintOrderId || payment_intent || ''}... Please wait or check your email for confirmation.`);
      setIsSuccess(null); // Undetermined
    }
  }, [searchParams, crossmintOrderId, paymentStatus, payment_intent, redirect_status]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-md mx-auto">
            {isSuccess === true && <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />}
            {isSuccess === false && <XCircleIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />}
            {isSuccess === null && <ClockIcon className="mx-auto h-16 w-16 text-yellow-500 mb-4" />}

            <h1 className="text-2xl sm:text-3xl font-bold mb-3">Payment Status</h1>
            <p className="mb-8 text-gray-700 dark:text-gray-300">{message}</p>
            <Button asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
            {/* Optionally, add a link to an order history page if available */}
            {/* {crossmintOrderId && isSuccess && (
              <p className="mt-4 text-sm">Your Crossmint Order ID: {crossmintOrderId}</p>
            )} */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Placeholder icons (replace with actual icons from lucide-react or similar)
const CheckCircleIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.06-1.06l-3.894 3.893-1.48-1.479a.75.75 0 0 0-1.06 1.061l2.005 2.004a.75.75 0 0 0 1.06 0l4.429-4.428Z" clipRule="evenodd" />
  </svg>
);

const XCircleIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
  </svg>
);

const ClockIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75S22.5 17.385 22.5 12 17.385 2.25 12 2.25ZM12 17.25a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-.75-.75H7.5a.75.75 0 0 0 0 1.5h3.75v3.75a.75.75 0 0 0 .75.75Z" clipRule="evenodd" />
  </svg>
);


export default PaymentStatusPage;
