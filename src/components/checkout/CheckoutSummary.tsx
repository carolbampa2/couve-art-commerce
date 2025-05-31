// src/components/checkout/CheckoutSummary.tsx
import { useFormContext } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface CheckoutSummaryProps {
  total: number;
  onProceedToPayment: () => void;
  isLoading: boolean;
  isPaymentReady: boolean;
}

const CheckoutSummary = ({ total, onProceedToPayment, isLoading, isPaymentReady }: CheckoutSummaryProps) => {
  const { register, formState: { errors }, setValue, watch } = useFormContext();
  
  // Example: watch a field if needed, e.g., for conditional logic
  // const selectedCountry = watch("country");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>Review your order and fill in shipping details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Shipping Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                {...register("firstName", { required: "First name is required" })}
              />
              {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message as string}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...register("lastName", { required: "Last name is required" })}
              />
              {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message as string}</p>}
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
              })}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message as string}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="123 Main St"
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message as string}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="New York"
                {...register("city", { required: "City is required" })}
              />
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message as string}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                placeholder="NY"
                {...register("state")} // Optional based on country
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="zip">ZIP/Postal Code</Label>
              <Input
                id="zip"
                placeholder="10001"
                {...register("zip", { required: "ZIP/Postal code is required" })}
              />
              {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip.message as string}</p>}
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="country">Country</Label>
            <Select
              defaultValue="US"
              onValueChange={(value) => setValue("country", value, { shouldValidate: true })}
            >
              <SelectTrigger id="country" {...register("country", { required: "Country is required" })}>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="GB">United Kingdom</SelectItem>
                <SelectItem value="BR">Brazil</SelectItem>
                {/* Add more countries as supported by Printful */}
              </SelectContent>
            </Select>
            {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country.message as string}</p>}
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${(total - 5.99).toFixed(2)}</span> {/* Example calculation */}
          </div>
          <div className="flex justify-between">
            <span>Shipping (Example)</span>
            <span>$5.99</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {!isPaymentReady ? (
          <Button 
            className="w-full"
            onClick={onProceedToPayment}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Confirm Details & Proceed to Payment"}
          </Button>
        ) : (
          <p className="text-sm text-center w-full text-gray-600">Please complete payment using the secure form above.</p>
        )}
      </CardFooter>
    </Card>
  );
};

export default CheckoutSummary;
