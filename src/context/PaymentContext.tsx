
import React, { createContext, useContext, useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

// Define types for our context
type PaymentMethod = 'card' | 'crypto';
type CryptoNetwork = 'ethereum' | 'bitcoin' | 'solana' | 'base';

interface PaymentContextType {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  cryptoNetwork: CryptoNetwork;
  setCryptoNetwork: (network: CryptoNetwork) => void;
  isProcessing: boolean;
  processCardPayment: (cardData: any) => Promise<void>;
  processCryptoPayment: (walletAddress: string) => Promise<void>;
}

// Create the context with a default value
const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

interface PaymentProviderProps {
  children: React.ReactNode;
}

export const PaymentProvider = ({ children }: PaymentProviderProps) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cryptoNetwork, setCryptoNetwork] = useState<CryptoNetwork>('ethereum');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Process credit card payment
  const processCardPayment = async (cardData: any) => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing - in a real app, you'd call your payment API
      console.log('Processing card payment with data:', cardData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success notification
      toast({
        title: "Payment Successful",
        description: "Your order has been processed via credit card",
        variant: "default",
      });
      
      // Redirect to success page
      navigate("/payment-success");
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Process crypto payment
  const processCryptoPayment = async (walletAddress: string) => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      console.log(`Processing ${cryptoNetwork} payment with wallet:`, walletAddress);
      
      // Simulate blockchain confirmation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success notification
      toast({
        title: "Payment Successful",
        description: `Your order has been processed via ${cryptoNetwork} network`,
        variant: "default",
      });
      
      // Redirect to success page
      navigate("/payment-success");
    } catch (error) {
      console.error('Crypto payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your crypto payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <PaymentContext.Provider 
      value={{
        paymentMethod,
        setPaymentMethod,
        cryptoNetwork,
        setCryptoNetwork,
        isProcessing,
        processCardPayment,
        processCryptoPayment
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
