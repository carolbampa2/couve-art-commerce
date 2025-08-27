-- Create orders table for Crossmint checkout process
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  crossmint_order_id text UNIQUE NOT NULL,
  status text DEFAULT 'pending_payment'::text,
  recipient_email text,
  shipping_address jsonb,
  product_id text,
  quantity integer,
  custom_data text,
  display_price numeric(10, 2), -- 10 digits, 2 decimal places
  display_currency text,
  stripe_client_secret text,
  printful_order_id text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders access
CREATE POLICY "Users can view orders by email" ON public.orders
  FOR SELECT 
  USING (recipient_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Allow service role to insert orders" ON public.orders
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow service role to update orders" ON public.orders
  FOR UPDATE 
  USING (true);