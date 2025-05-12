
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import ShippingForm from "./ShippingForm";

interface CheckoutSummaryProps {
  total: number;
  isProcessing: boolean;
  shippingForm: any;
  handlePayment: () => void;
}

const CheckoutSummary = ({ 
  total, 
  isProcessing, 
  shippingForm, 
  handlePayment 
}: CheckoutSummaryProps) => {
  return (
    <Card className="sticky top-8">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
        <ShippingForm shippingForm={shippingForm} />
        
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
  );
};

export default CheckoutSummary;
