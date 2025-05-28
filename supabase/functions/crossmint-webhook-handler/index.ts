// supabase/functions/crossmint-webhook-handler/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Webhook } from "https://esm.sh/svix@1.20.0";

console.log("Crossmint Webhook Handler function initializing (v3.2 - mock shipping)...");

// Centralized function to prepare data for Printful
function prepareAndLogPrintfulOrder(
  orderId: string,
  productId: string | null, 
  quantity: number | null, 
  customData: string | undefined | null, 
  // Shipping address and email will be mocked if mockShipping is true
  shippingAddressFromWebhook: any, // Actual shipping address from webhook (if available)
  recipientEmailFromWebhook: string | null, // Actual email from webhook
  mockShipping: boolean = false // Default to false, but we'll set it to true from handler
) {
  console.log(`Preparing Printful order for Crossmint Order ID: ${orderId}`);

  const printfulApiKey = Deno.env.get("PRINTFUL_API_KEY");
  if (!printfulApiKey) {
    console.error("PRINTFUL_API_KEY is not set. Cannot prepare Printful order.");
    return;
  }
  // console.log("Printful API Key found (presence check only).");

  if (!productId || quantity === null || quantity === undefined || quantity <= 0) {
    console.error(`Critical product information (productId: ${productId}, quantity: ${quantity}) is missing or invalid for Printful order ${orderId}.`);
    return;
  }
  
  let printfulRecipient: any;

  if (mockShipping) {
    console.warn("Using MOCKED shipping data for this Printful order preparation as primaryShippingAddress was not found in webhook.");
    printfulRecipient = {
      name: "Mock Customer",
      address1: "123 Mock Street",
      city: "Mockville",
      state_code: "MC",
      country_code: "US",
      zip: "90210",
      email: recipientEmailFromWebhook || "mock-customer@example.com", // Use webhook email if available
    };
  } else if (shippingAddressFromWebhook && recipientEmailFromWebhook) {
    console.log("Using LIVE shipping data from webhook for Printful order preparation.");
    printfulRecipient = {
      name: shippingAddressFromWebhook?.name,
      address1: shippingAddressFromWebhook?.street1 || shippingAddressFromWebhook?.street,
      city: shippingAddressFromWebhook?.city,
      state_code: shippingAddressFromWebhook?.state_code || shippingAddressFromWebhook?.state,
      country_code: shippingAddressFromWebhook?.country_code || shippingAddressFromWebhook?.country,
      zip: shippingAddressFromWebhook?.postal_code || shippingAddressFromWebhook?.zip,
      email: recipientEmailFromWebhook,
    };
    // Basic validation for live recipient data
    if (!printfulRecipient.name || !printfulRecipient.address1 || !printfulRecipient.city || !printfulRecipient.country_code || !printfulRecipient.zip) {
      console.error(`Critical LIVE shipping information missing or incomplete for Printful order ${orderId}. Received:`, JSON.stringify(shippingAddressFromWebhook));
      console.error("Constructed Printful recipient for logging:", JSON.stringify(printfulRecipient));
      console.warn("Falling back to MOCKED shipping data due to incomplete live data.");
      // Fallback to mocked data if live data is incomplete
      printfulRecipient.name = printfulRecipient.name || "Mock Customer Fallback";
      printfulRecipient.address1 = printfulRecipient.address1 || "123 Mock Street";
      printfulRecipient.city = printfulRecipient.city || "Mockville";
      printfulRecipient.state_code = printfulRecipient.state_code || "MC";
      printfulRecipient.country_code = printfulRecipient.country_code || "US";
      printfulRecipient.zip = printfulRecipient.zip || "90210";
      printfulRecipient.email = printfulRecipient.email || "mock-fallback@example.com";
    }
  } else {
     console.error(`Shipping data from webhook is missing and mocking is not enabled for order ${orderId}. Cannot prepare Printful recipient.`);
     return;
  }


  const printfulItems = [{
    external_variant_id: productId, 
    quantity: quantity,
    name: `Product: ${productId} ${customData ? `(${customData})` : ''}` 
  }];

  console.log("Prepared Printful Recipient:", JSON.stringify(printfulRecipient));
  console.log("Prepared Printful Items:", JSON.stringify(printfulItems));
  console.log("Mock Printful Order: Would attempt to send this data to Printful API for order:", orderId);
}

// Main event handling logic
function handleVerifiedWebhook(verifiedPayload: any) {
  const eventType = verifiedPayload.type;
  const eventData = verifiedPayload.data; 

  if (!eventData) {
    console.error(`eventData (verifiedPayload.data) is undefined for event type ${eventType}. Full verified payload:`, JSON.stringify(verifiedPayload, null, 2));
    return;
  }

  const orderId = eventData.orderId;
  console.log(`Processing event type: ${eventType}. Order ID: ${orderId}.`);
  // Log the full eventData for the current event for detailed inspection
  console.log("Full eventData (verifiedPayload.data) for this event:", JSON.stringify(eventData, null, 2));

  let callDataProductId = null;
  let callDataQuantity = null;
  let callDataCustomData = null;
  
  // Try to get shipping address and email from standard locations in the payload
  // These might be present in payment.succeeded or potentially other events.
  const shippingAddress = eventData.shippingAddress; // Root level, as per some Crossmint examples
  const buyerEmail = eventData.buyerIdentity?.email || // From buyerIdentity object
                     eventData.payment?.receiptEmail ||    // From payment object
                     eventData.delivery?.recipient?.email; // From delivery recipient object

  if (eventData.lineItems && eventData.lineItems.length > 0) {
    const callData = eventData.lineItems[0]?.callData;
    if (callData) {
      callDataProductId = callData.productId;
      callDataQuantity = callData.quantity; 
      callDataCustomData = callData.customData;
      console.log(`Extracted from lineItems[0].callData: productId=${callDataProductId}, quantity=${callDataQuantity}, customData=${callDataCustomData}, contractTotalPrice=${callData.totalPrice}, buyerInCallData=${callData.buyer}`);
    } else {
      console.warn(`callData object not found in lineItems[0] for order ${orderId}`);
    }
  } else {
    console.warn(`lineItems array not found or empty for order ${orderId}`);
  }
  
  if (eventType === "orders.payment.succeeded") {
    console.log(`Captured for orders.payment.succeeded (Order ID: ${orderId}): shippingAddress directly from eventData:`, JSON.stringify(shippingAddress), `buyerEmail: ${buyerEmail}`);
    
    if (callDataProductId && callDataQuantity !== null && callDataQuantity > 0) {
      // If shippingAddress is NOT found in the webhook, mockShipping will be true by default in the next call.
      // If it IS found, mockShipping will be false.
      prepareAndLogPrintfulOrder(orderId, callDataProductId, callDataQuantity, callDataCustomData, shippingAddress, buyerEmail, !shippingAddress);
    } else {
      console.warn(`Missing critical callData (productId or quantity) in orders.payment.succeeded for order ${orderId}. Cannot prepare Printful order.`);
    }
  } else if (eventType === "orders.delivery.completed") {
    console.log(`Order Delivery Completed for ${orderId}. TxID: ${eventData.delivery?.txId}. Recipient Email from delivery: ${eventData.delivery?.recipient?.email}`);
    // We generally expect shipping address to come from payment.succeeded.
    // If we were to trigger Printful from here, we'd need a strategy to get that shipping address.
    // For now, the primary Printful prep call is in payment.succeeded.
    if (!shippingAddress) { // If shippingAddress was not in the delivery.completed eventData root
        console.warn(`Shipping address was not found at the root of eventData for orders.delivery.completed. Printful order for ${orderId} should have been prepared by payment.succeeded if shipping was available there.`);
    }
  } else {
    console.log(`Received and verified (but not specifically handled for Printful prep) event type: ${eventType}`);
  }
}

// --- Main Server ---
serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const signingSecret = Deno.env.get("CROSSMINT_WEBHOOK_SIGNING_SECRET");
  if (!signingSecret) {
    console.error("CROSSMINT_WEBHOOK_SIGNING_SECRET is not configured. Cannot verify webhook.");
    return new Response("Webhook signing secret not configured on server.", { status: 500 });
  }

  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing Svix headers for verification.");
    return new Response("Missing Svix headers", { status: 400 });
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
    handleVerifiedWebhook(verifiedPayload); 

    return new Response("Webhook processed successfully", { status: 200 });

  } catch (err) {
    console.error("Webhook verification failed or error during processing:", err.message);
    if (rawBody && err.message.includes("signature")) { 
        console.error("Raw body for failed signature verification:", rawBody);
    }
    return new Response(\`Webhook error: ${err.message}\`, { status: 400 });
  }
});
console.log("Crossmint Webhook Handler function script loaded (v3.2 - mock shipping).");
