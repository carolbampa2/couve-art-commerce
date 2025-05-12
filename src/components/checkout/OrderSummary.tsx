
import { Card, CardContent } from "@/components/ui/card";

interface Product {
  id: string;
  title: string;
  artist: string;
  price: number;
  imageUrl: string;
  size: string;
  quantity: number;
}

interface OrderSummaryProps {
  product: Product;
}

const OrderSummary = ({ product }: OrderSummaryProps) => {
  // Calculate summary
  const subtotal = product.price * product.quantity;
  const shipping = 5.99;
  const total = subtotal + shipping;

  // Artist and platform split calculation (60/40)
  const artistShare = total * 0.6;
  const platformShare = total * 0.4;

  return (
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
  );
};

export default OrderSummary;
