// supabase/functions/create-crossmint-headless-checkout/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'; // Import SupabaseClient type
import { v4 as uuidv4 } from "https://deno.land/std@0.168.0/uuid/mod.ts";

console.log("Function create-crossmint-headless-checkout initializing (v2)...");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const crossmintCollectionId = "f8fcd198-35a2-4f6f-9b48-78538b5c8446"; // Staging Collection ID

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { 
      status: 405, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  // Use SUPABASE_SERVICE_ROLE_KEY for admin operations from a trusted server environment
  const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const crossmintAPIKey = Deno.env.get("CROSSMINT_SERVER_API_KEY_STAGING");

  if (!supabaseUrl || !supabaseServiceRoleKey || !crossmintAPIKey) {
    console.error("Missing environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or CROSSMINT_SERVER_API_KEY_STAGING");
    return new Response(JSON.stringify({ error: "Server configuration error." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Initialize Supabase client with the service role key for admin operations
  const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

  try {
    const {
      shippingAddress, // Expected: { firstName, lastName, address1, city, state, zip, country }
      email,
      productId,
      quantity,
      customData,
      displayPrice // Expected: string e.g., "1.00"
    } = await req.json();

    if (!shippingAddress || !email || !productId || !quantity || !displayPrice ||
        !shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.address1 ||
        !shippingAddress.city || !shippingAddress.zip || !shippingAddress.country) {
      return new Response(JSON.stringify({ error: "Missing required fields in request body." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const crossmintOrderPayload = {
      recipient: {
        email: String(email),
        physicalAddress: {
          name: `${String(shippingAddress.firstName)} ${String(shippingAddress.lastName)}`,
          line1: String(shippingAddress.address1),
          line2: String(shippingAddress.address2 || ""),
          city: String(shippingAddress.city),
          state: String(shippingAddress.state || ""), // State can be optional for some countries
          postalCode: String(shippingAddress.zip),
          country: String(shippingAddress.country), // Expects 2-letter ISO code e.g. "US"
        },
      },
      payment: {
        method: "stripe-payment-element",
        currency: "USD", // Hardcoded as per plan
        amount: String(displayPrice), // The actual charge amount
        receiptEmail: String(email),
      },
      lineItems: [
        {
          collectionLocator: `crossmint:${crossmintCollectionId}`,
          quantity: Number(quantity),
          callData: {
            totalPrice: "0",
            productId: String(productId),
            customData: String(customData || ""),
          },
        },
      ],
      idempotencyKey: uuidv4(),
    };

    console.log("Sending payload to Crossmint /orders:", JSON.stringify(crossmintOrderPayload, null, 2));

    const crossmintResponse = await fetch("https://staging.crossmint.com/api/2022-06-09/orders", {
      method: "POST",
      headers: {
        "X-API-KEY": crossmintAPIKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(crossmintOrderPayload),
    });

    const responseBodyText = await crossmintResponse.text(); // Read body once
    if (!crossmintResponse.ok) {
      console.error(`Crossmint API error: ${crossmintResponse.status}`, responseBodyText);
      throw new Error(`Crossmint API Error: ${crossmintResponse.status} ${responseBodyText}`);
    }

    const crossmintOrder = JSON.parse(responseBodyText);
    console.log("Crossmint API success response:", JSON.stringify(crossmintOrder, null, 2));

    const orderIdFromCrossmint = crossmintOrder.order?.orderId;
    const stripeClientSecret = crossmintOrder.order?.payment?.preparation?.stripeClientSecret;
    const stripePublishableKey = crossmintOrder.order?.payment?.preparation?.stripePublishableKey;

    if (!orderIdFromCrossmint || !stripeClientSecret || !stripePublishableKey) {
      console.error("Missing critical data from Crossmint response:", { orderIdFromCrossmint, stripeClientSecret, stripePublishableKey });
      throw new Error("Crossmint response missing orderId or Stripe preparation details.");
    }

    const { data: dbData, error: dbError } = await supabaseAdmin
      .from("orders")
      .insert({
        crossmint_order_id: orderIdFromCrossmint,
        status: "pending_payment",
        recipient_email: email,
        shipping_address: shippingAddress, // Storing the whole object as jsonb
        product_id: productId,
        quantity: Number(quantity),
        custom_data: customData,
        display_price: parseFloat(displayPrice), // Store as numeric if your column is numeric
        display_currency: "USD",
        stripe_client_secret: stripeClientSecret,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Supabase DB insert error:", dbError);
      throw new Error(`Failed to save order to database: ${dbError.message}`);
    }

    console.log("Order saved to Supabase DB, ID:", dbData ? dbData.id : "N/A (check select)");

    return new Response(
      JSON.stringify({
        crossmintOrderId: orderIdFromCrossmint,
        stripeClientSecret: stripeClientSecret,
        stripePublishableKey: stripePublishableKey,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in create-crossmint-headless-checkout:", error.message, error.stack);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// SQL for 'orders' table (example for user, place in Supabase SQL editor)
/*
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  crossmint_order_id text UNIQUE NOT NULL,
  status text DEFAULT 'pending_payment'::text,
  recipient_email text,
  shipping_address jsonb,
  product_id text,
  quantity integer,
  custom_data text,
  display_price numeric(10, 2), -- Example: 10 digits, 2 decimal places
  display_currency text,
  stripe_client_secret text,
  printful_order_id text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
-- Make sure RLS is off for testing or appropriate policies are in place if using anon key.
-- For service_role_key, RLS is bypassed.
*/
