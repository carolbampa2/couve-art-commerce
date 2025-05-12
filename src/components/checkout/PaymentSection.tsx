
import { Card, CardContent } from "@/components/ui/card";
import PaymentMethods from "./PaymentMethods";

interface PaymentSectionProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  cryptoNetwork: string;
  setCryptoNetwork: (network: string) => void;
  form: any;
}

const PaymentSection = ({
  paymentMethod,
  setPaymentMethod,
  cryptoNetwork,
  setCryptoNetwork,
  form
}: PaymentSectionProps) => {
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
