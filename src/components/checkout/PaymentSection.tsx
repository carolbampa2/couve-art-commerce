
import { Card, CardContent } from "@/components/ui/card";
import PaymentMethods from "./PaymentMethods";
import { usePayment } from "@/context/PaymentContext";

interface PaymentSectionProps {
  form: any;
}

const PaymentSection = ({ form }: PaymentSectionProps) => {
  const { 
    paymentMethod, 
    setPaymentMethod, 
    cryptoNetwork, 
    setCryptoNetwork 
  } = usePayment();
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        <PaymentMethods 
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          cryptoNetwork={cryptoNetwork}
          setCryptoNetwork={setCryptoNetwork}
          form={form}
        />
      </CardContent>
    </Card>
  );
};

export default PaymentSection;
