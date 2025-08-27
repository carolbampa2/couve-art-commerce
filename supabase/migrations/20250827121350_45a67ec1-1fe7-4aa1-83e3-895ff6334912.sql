-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view orders by email" ON public.orders;
DROP POLICY IF EXISTS "Allow service role to insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow service role to update orders" ON public.orders;

-- Create proper policies for orders
CREATE POLICY "Users can view orders by email" ON public.orders
  FOR SELECT 
  USING (recipient_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Service role can manage all orders" ON public.orders
  FOR ALL
  USING (true)
  WITH CHECK (true);