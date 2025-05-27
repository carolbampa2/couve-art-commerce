// supabase/functions/crossmint-webhook-handler/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Webhook } from "https://esm.sh/svix@1.20.0"; // Using esm.sh for svix

console.log("Crossmint Webhook Handler function initializing (v2)...");

serve(async (req: Request) => {
  if (req.method !== "POST") {
    console.log(`Method Not Allowed: ${req.method}`);
    return new Response("Method Not Allowed", { status: 405 });
  }

  console.log("Received POST request. Headers:", Object.fromEntries(req.headers.entries()));

  const signingSecret = Deno.env.get("CROSSMINT_WEBHOOK_SIGNING_SECRET");
  if (!signingSecret) {
    console.error("CROSSMINT_WEBHOOK_SIGNING_SECRET is not configured.");
    console.warn("Proceeding without signature verification as secret is not set (for initial setup or testing).");
    
    try {
      const rawBodyForDebug = await req.text(); 
      console.log("Raw request body (no secret set):", rawBodyForDebug);
      const payloadForDebug = JSON.parse(rawBodyForDebug);
      console.log("Parsed JSON payload (no secret set):", payloadForDebug);
      if (payloadForDebug && payloadForDebug.type) {
        await handleEventLogic(payloadForDebug, "DEBUG_MODE_NO_SECRET");
      }
    } catch (e) {
      console.error("Error reading or parsing body for debug (no secret set):", e.message);
    }
    return new Response("Webhook received (secret not set, verification skipped).", { status: 200 });
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
    const payload = wh.verify(rawBody, headersForSvix); 

    console.log("Successfully verified webhook payload.");
    
    await handleEventLogic(payload, payload.type);

    return new Response("Webhook processed successfully", { status: 200 });

  } catch (err) {
    console.error("Webhook verification failed or error during processing:", err.message);
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }
});

// Enhanced event handling logic
async function handleEventLogic(payload: any, eventType: string) {
  console.log(`Processing event type: ${eventType}. Full payload:`, JSON.stringify(payload, null, 2));
  
  // Attempt to read Printful API Key
  const printfulApiKey = Deno.env.get("PRINTFUL_API_KEY");
  if (printfulApiKey) {
    console.log("Printful API Key found (length):", printfulApiKey.length);
  } else {
    console.warn("PRINTFUL_API_KEY is not set in environment variables.");
  }

  if (eventType === "orders.payment.succeeded") {
    const eventData = payload.payload; // Actual event data is in payload.payload
    const orderIdentifier = eventData.orderIdentifier;
    const totalPrice = eventData.totalPrice;
    const buyerIdentity = eventData.buyerIdentity;
    const shippingAddress = eventData.shippingAddress;
    const lineItems = eventData.lineItems;

    console.log(`Order Payment Succeeded: ID=${orderIdentifier}`);
    console.log(`  Total Price: ${totalPrice?.amount} ${totalPrice?.currency}`);
    console.log(`  Buyer Identity: Email=${buyerIdentity?.email}, Wallet=${buyerIdentity?.walletAddress}`);
    
    if (!buyerIdentity?.email) {
        console.warn(`  WARNING: Buyer email is missing for order ${orderIdentifier}.`);
    }

    console.log(`  Shipping Address:`);
    if (shippingAddress) {
      console.log(`    Name: ${shippingAddress.name}`);
      console.log(`    Street1: ${shippingAddress.street1 || shippingAddress.street}`); // Check for street1 or street
      console.log(`    Street2: ${shippingAddress.street2 || ''}`);
      console.log(`    City: ${shippingAddress.city}`);
      console.log(`    State: ${shippingAddress.state || ''}`);
      console.log(`    Postal Code: ${shippingAddress.postalCode || shippingAddress.zip}`); // Check for postalCode or zip
      console.log(`    Country: ${shippingAddress.country}`);
      
      // Check for critical missing shipping fields
      if (!shippingAddress.name || !(shippingAddress.street1 || shippingAddress.street) || !shippingAddress.city || !(shippingAddress.postalCode || shippingAddress.zip) || !shippingAddress.country) {
        console.warn(`  WARNING: Critical shipping address information is missing for order ${orderIdentifier}. Cannot prepare Printful order.`);
      }
    } else {
      console.warn(`  WARNING: Shipping address is missing entirely for order ${orderIdentifier}. Cannot prepare Printful order.`);
    }

    console.log("  Line Items (Payment Succeeded):");
    const printfulItems: any[] = [];
    if (lineItems && lineItems.length > 0) {
      lineItems.forEach((item: any, index: number) => {
        console.log(`    Item ${index + 1}: Full Data: ${JSON.stringify(item, null, 2)}`);
        console.log(`    Item ${index + 1}: Metadata: ${JSON.stringify(item.metadata, null, 2)}`);
        console.log(`    Item ${index + 1}: callData: ${JSON.stringify(item.callData, null, 2)}`); // Also check callData if present

        // Attempt to extract productId, quantity, and customData from metadata or callData
        // The exact path might vary based on Crossmint's payload structure.
        // We are looking for the 'productId', 'quantity', and 'customData' we set in the frontend.
        const callData = item.metadata?.callData || item.callData; // Prioritize metadata.callData, then item.callData
        let productIdForPrintful: string | null = null;
        let quantityForPrintful: number | null = null;
        let customDataFromWebhook: any = null;

        if (callData) {
            console.log(`    Item ${index + 1}: Found callData object: ${JSON.stringify(callData)}`);
            productIdForPrintful = callData.productId; // e.g., "urban-dreams-tee-m"
            quantityForPrintful = parseInt(callData.quantity, 10); // Ensure it's a number
            customDataFromWebhook = callData.customData; // e.g., "M" or other details
            console.log(`      Extracted productId: ${productIdForPrintful}, quantity: ${quantityForPrintful}, customData: ${customDataFromWebhook}`);
        } else {
            console.warn(`    Item ${index + 1}: WARNING - 'callData' (containing productId, quantity, customData) not found in item.metadata or item.callData.`);
        }
        
        if (productIdForPrintful && quantityForPrintful && quantityForPrintful > 0) {
          // For Printful, 'external_variant_id' is often used.
          // If your `productIdForPrintful` is already the external_variant_id, use it directly.
          // If `customDataFromWebhook` represents a size that needs to be combined with a base product ID
          // to form the `external_variant_id`, you'd do that logic here.
          // For this task, we assume productIdForPrintful is the external_variant_id.
          printfulItems.push({
            'external_variant_id': productIdForPrintful, // This should be the actual Printful variant ID
            'quantity': quantityForPrintful
            // Potentially add 'custom_text_fields' or other Printful specific item properties if needed based on customDataFromWebhook
          });
        } else {
            console.warn(`    Item ${index + 1}: WARNING - Could not determine productId or valid quantity for Printful.`);
        }
      });
    } else {
      console.warn(`  WARNING: No line items found for order ${orderIdentifier}.`);
    }

    // Prepare Mock Printful Order Data if possible
    if (shippingAddress && buyerIdentity?.email && printfulItems.length > 0) {
      const printfulRecipient = {
        name: shippingAddress.name,
        address1: shippingAddress.street1 || shippingAddress.street,
        address2: shippingAddress.street2 || undefined, // Use undefined if not present
        city: shippingAddress.city,
        state_code: shippingAddress.state || undefined, // Use state_code for US states
        country_code: shippingAddress.country, // Ensure this is a 2-letter ISO country code
        zip: shippingAddress.postalCode || shippingAddress.zip,
        email: buyerIdentity.email,
        // phone: shippingAddress.phone, // Optional, add if available
      };

      console.log("  Mock Printful Recipient Data:", JSON.stringify(printfulRecipient, null, 2));
      console.log("  Mock Printful Items Data:", JSON.stringify(printfulItems, null, 2));

      if (printfulApiKey) {
        console.log("  Mock Printful Order: Would attempt to send the prepared recipient and items data to Printful API.");
        // TODO: In a future step, make the actual Printful API call here.
        // Example: await callPrintfulApi(printfulApiKey, printfulRecipient, printfulItems, orderIdentifier);
      } else {
        console.warn("  Mock Printful Order: PRINTFUL_API_KEY is missing. Cannot make actual API call.");
      }
    } else {
      console.warn(`  WARNING: Cannot prepare full mock Printful order data for order ${orderIdentifier} due to missing shipping address, buyer email, or valid line items.`);
    }

  } else if (eventType === "orders.delivery.completed") {
    const eventData = payload.payload;
    const orderIdentifier = eventData.orderIdentifier;
    const txId = eventData.txId;
    const recipient = eventData.recipient;
    const lineItems = eventData.lineItems;

    console.log(`Order Delivery Completed: ID=${orderIdentifier}, TxID=${txId}, Recipient=${recipient?.walletAddress}`);
    
    console.log("  Line Items (Delivery Completed):");
    if (lineItems && lineItems.length > 0) {
      lineItems.forEach((item: any, index: number) => {
        console.log(`    Item ${index + 1}: Full Data: ${JSON.stringify(item, null, 2)}`);
        console.log(`    Item ${index + 1}: Metadata: ${JSON.stringify(item.metadata, null, 2)}`);
        console.log(`    Item ${index + 1}: callData: ${JSON.stringify(item.callData, null, 2)}`); // Also check callData

        // Attempt to extract productId and quantity from metadata or callData as a confirmation
        const callData = item.metadata?.callData || item.callData;
        if (callData) {
            console.log(`      Extracted (for confirmation) productId: ${callData.productId}, quantity: ${callData.quantity}, customData: ${callData.customData}`);
        } else {
            console.warn(`    Item ${index + 1}: WARNING - 'callData' not found in item.metadata or item.callData during delivery event.`);
        }
      });
    } else {
      console.warn(`  WARNING: No line items found in delivery completed event for order ${orderIdentifier}.`);
    }
    // Further processing for this event...
  } else {
    console.log(`Received and verified unhandled event type: ${eventType}`);
  }
}

// Note on Supabase import_map.json:
// {
//   "imports": {
//     "svix": "https://esm.sh/svix@1.20.0"
//   }
// }
console.log("Crossmint Webhook Handler function script loaded (v2).");
