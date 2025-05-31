// supabase/functions/crossmint-webhook-handler/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Webhook } from "https://esm.sh/svix@1.20.0";

console.log("Crossmint Webhook Handler function initializing (v3.5 - Printful API call)...");

// Centralized function to prepare data for Printful and make API call
async function prepareAndLogPrintfulOrder(
  orderId: string, // This is the crossmint_order_id
  productId: string | null,
  quantity: number | null,
  customData: string | undefined | null,
  shippingAddressFromDb: any,
  recipientEmailFromDb: string | null,
  mockShippingFallback: boolean = false, // Should be false when called with DB data
  supabaseAdmin: SupabaseClient // Added Supabase client for DB updates
) {
  console.log(`Attempting to create Printful order for Crossmint Order ID: ${orderId}`);

  const printfulApiKey = Deno.env.get("PRINTFUL_API_KEY");
  if (!printfulApiKey) {
    console.error(`PRINTFUL_API_KEY is not set. Cannot create Printful order for ${orderId}.`);
    await supabaseAdmin.from('orders').update({ status: 'printful_submission_failed', updated_at: new Date().toISOString(), printful_response: { error: "PRINTFUL_API_KEY not set on server" } }).eq('crossmint_order_id', orderId);
    return;
  }

  if (!productId || quantity === null || quantity === undefined || quantity <= 0) {
    console.error(`Critical product information (productId: ${productId}, quantity: ${quantity}) is missing or invalid for Printful order ${orderId}.`);
    await supabaseAdmin.from('orders').update({ status: 'printful_submission_failed', updated_at: new Date().toISOString(), printful_response: { error: "Missing product info for Printful" } }).eq('crossmint_order_id', orderId);
    return;
  }

  let printfulRecipient: any;

  if (mockShippingFallback) {
    console.warn(`Using MOCKED shipping data for Printful order ${orderId} as a fallback.`);
    printfulRecipient = {
      name: "Mock Customer (Fallback)", address1: "123 Mock Fallback St", city: "Mockville",
      state_code: "MC", country_code: "US", zip: "90210",
      email: recipientEmailFromDb || "mock-customer-fallback@example.com",
    };
  } else if (shippingAddressFromDb && recipientEmailFromDb) {
    printfulRecipient = {
      name: shippingAddressFromDb?.name || `${shippingAddressFromDb?.firstName || ''} ${shippingAddressFromDb?.lastName || ''}`.trim(),
      address1: shippingAddressFromDb?.address1 || shippingAddressFromDb?.address,
      address2: shippingAddressFromDb?.address2 || undefined,
      city: shippingAddressFromDb?.city,
      state_code: shippingAddressFromDb?.state_code || shippingAddressFromDb?.state,
      country_code: shippingAddressFromDb?.country_code || shippingAddressFromDb?.country,
      zip: shippingAddressFromDb?.postal_code || shippingAddressFromDb?.zip,
      email: recipientEmailFromDb,
    };

    if (!printfulRecipient.name || !printfulRecipient.address1 || !printfulRecipient.city || !printfulRecipient.country_code || !printfulRecipient.zip) {
      console.error(`Critical LIVE shipping information from DB is missing or incomplete for Printful order ${orderId}. Received:`, JSON.stringify(shippingAddressFromDb));
      await supabaseAdmin.from('orders').update({ status: 'printful_submission_failed', updated_at: new Date().toISOString(), printful_response: { error: "Incomplete shipping data from DB" } }).eq('crossmint_order_id', orderId);
      return;
    }
  } else {
     console.error(`Shipping data from DB is missing for order ${orderId}, and fallback not triggered. Cannot prepare Printful recipient.`);
     await supabaseAdmin.from('orders').update({ status: 'printful_submission_failed', updated_at: new Date().toISOString(), printful_response: { error: "Missing shipping data from DB, no fallback" } }).eq('crossmint_order_id', orderId);
     return;
  }

  const printfulItems = [{
    external_variant_id: productId,
    quantity: Number(quantity), // Ensure quantity is number
    name: `Product: ${productId} ${customData ? `(${customData})` : ''}` // Optional: name for display on packing slip
  }];

  const printfulOrderPayload = {
    external_id: orderId, // Using crossmint_order_id as Printful's external_id
    recipient: printfulRecipient,
    items: printfulItems,
    confirm: true, // Auto-confirms the order for fulfillment
    // packing_slip: { // Optional: customize packing slip
    //   email: recipientEmailFromDb,
    //   message: `Thank you for your order! Crossmint Order ID: ${orderId}`
    // }
  };

  console.log(`Sending order to Printful API for Crossmint Order ID ${orderId}. Payload:`, JSON.stringify(printfulOrderPayload, null, 2));

  try {
    const printfulResponse = await fetch("https://api.printful.com/orders", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${printfulApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(printfulOrderPayload),
    });

    const printfulResultText = await printfulResponse.text();
    const printfulResultJson = JSON.parse(printfulResultText); // Try to parse JSON regardless of status for logging

    if (!printfulResponse.ok) {
      console.error(`Printful API Error (${printfulResponse.status}) for Crossmint Order ID ${orderId}:`, printfulResultText);
      await supabaseAdmin.from('orders').update({
        status: 'printful_submission_failed',
        printful_response: printfulResultJson, // Store error response
        updated_at: new Date().toISOString()
      }).eq('crossmint_order_id', orderId);
      return;
    }

    const printfulOrder = printfulResultJson.result;
    console.log(`Printful API Success for Crossmint Order ID ${orderId}. Printful Order ID: ${printfulOrder.id}, Status: ${printfulOrder.status}`);

    await supabaseAdmin.from('orders').update({
      status: 'printful_order_created', // Or map Printful status if needed
      printful_order_id: String(printfulOrder.id),
      printful_response: printfulOrder, // Store success response
      updated_at: new Date().toISOString()
    }).eq('crossmint_order_id', orderId);

  } catch (apiError) {
    console.error(`Error during Printful API call for Crossmint Order ID ${orderId}:`, apiError.message, apiError.stack);
    await supabaseAdmin.from('orders').update({
      status: 'printful_submission_failed',
      printful_response: { error: apiError.message, stack: apiError.stack },
      updated_at: new Date().toISOString()
    }).eq('crossmint_order_id', orderId);
  }
}

// Enhanced event handling logic with DB lookup
async function handleVerifiedWebhook(verifiedPayload: any, supabaseAdmin: SupabaseClient) {
  const eventType = verifiedPayload.type;
  const eventData = verifiedPayload.data;
  const crossmintOrderId = eventData?.orderId;

  if (!eventData || !crossmintOrderId) {
    console.error(`eventData or crossmintOrderId is undefined. Type: ${eventType}. Full payload:`, JSON.stringify(verifiedPayload, null, 2));
    return;
  }

  console.log(`Processing event type: ${eventType}. Crossmint Order ID: ${crossmintOrderId}.`);

  const { data: orderFromDb, error: dbFetchError } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('crossmint_order_id', crossmintOrderId)
    .single();

  if (dbFetchError || !orderFromDb) {
    console.error(`Error fetching order from DB for crossmint_order_id ${crossmintOrderId}:`, dbFetchError?.message || "Order not found.");
    return;
  }
  console.log("Fetched order from DB:", JSON.stringify(orderFromDb, null, 2));

  const {
    recipient_email, shipping_address, product_id,
    quantity, custom_data, status: currentDbStatus
  } = orderFromDb;

  let newStatus = currentDbStatus;
  if (eventType === "orders.payment.succeeded" && currentDbStatus === "pending_payment") {
    newStatus = "payment_succeeded";
  } else if (eventType === "orders.delivery.completed" &&
             (currentDbStatus === "pending_payment" || currentDbStatus === "payment_succeeded")) {
    newStatus = "delivery_completed";
  }


  if (newStatus !== currentDbStatus) {
    const { error: dbUpdateError } = await supabaseAdmin
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('crossmint_order_id', crossmintOrderId);

    if (dbUpdateError) {
      console.error(`Error updating order status for ${crossmintOrderId} to ${newStatus}:`, dbUpdateError.message);
    } else {
      console.log(`Order ${crossmintOrderId} status updated in DB to ${newStatus}.`);
    }
  }

  if (eventType === "orders.delivery.completed") {
    console.log(`Order ${crossmintOrderId} delivery completed. Attempting to create Printful order with data from DB.`);
    if (shipping_address && recipient_email && product_id && quantity !== null && quantity > 0) {
      await prepareAndLogPrintfulOrder( // Ensure to await this async function
        crossmintOrderId,
        product_id,
        Number(quantity),
        custom_data,
        shipping_address,
        recipient_email,
        false, // mockShippingFallback = false
        supabaseAdmin // Pass Supabase client
      );
    } else {
      console.warn(`Data from DB for order ${crossmintOrderId} is insufficient for Printful. Missing: shipping_address, recipient_email, product_id, or valid quantity.`);
    }
  } else if (eventType === "orders.payment.succeeded") {
      console.log(`Payment succeeded for ${crossmintOrderId}. Data ready in DB. 'orders.delivery.completed' event will trigger Printful creation.`);
  } else {
    console.log(`Event type ${eventType} for order ${crossmintOrderId} does not trigger Printful creation at this stage.`);
  }
}

// --- Main Server ---
serve(async (req: Request) => {
  if (req.method !== "POST" && req.method !== "OPTIONS") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Svix-Id, Svix-Timestamp, Svix-Signature",
      },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const signingSecret = Deno.env.get("CROSSMINT_WEBHOOK_SIGNING_SECRET");

  if (!supabaseUrl || !supabaseServiceRoleKey || !signingSecret) {
    console.error("Missing required environment variables (Supabase URL, Service Role Key, or Svix Signing Secret).");
    return new Response("Server configuration error.", { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
  }

  const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing Svix headers for verification.");
    return new Response("Missing Svix headers", { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
  }

  const headersForSvix = {
    "svix-id": svix_id,
    "svix-timestamp": svix_timestamp,
    "svix-signature": svix_signature,
  };

  const rawBody = await req.text();

  try {
    const wh = new Webhook(signingSecret);
    const verifiedPayload = wh.verify(rawBody, headersForSvix);

    console.log("Successfully verified webhook payload. Type:", verifiedPayload.type);
    await handleVerifiedWebhook(verifiedPayload, supabaseAdmin);

    return new Response("Webhook processed successfully", { status: 200, headers: { "Access-Control-Allow-Origin": "*" } });

  } catch (err) {
    console.error("Webhook verification failed or error during processing:", err.message);
    if (rawBody && err.message.includes("signature")) {
        console.error("Raw body for failed signature verification:", rawBody);
    }
    return new Response(`Webhook error: ${err.message}`, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
  }
});

console.log("Crossmint Webhook Handler function script loaded (v3.5 - Printful API call).");
