
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PRINTFUL-ORDER] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    logStep("Starting Printful order creation");

    const { orderId, customerInfo, shippingInfo } = await req.json()

    const printfulApiKey = Deno.env.get('PRINTFUL_API_KEY')
    if (!printfulApiKey) {
      throw new Error('Printful API key not configured')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get order details from Supabase
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select(`
        *,
        products (
          *,
          printful_sync_variants
        )
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      throw new Error('Order not found')
    }

    logStep("Order found", { orderId, productTitle: order.products.title });

    // Check if this is a Printful product
    if (!order.products.is_printful_product || !order.products.printful_product_id) {
      logStep("Not a Printful product, skipping", { productId: order.products.id });
      return new Response(
        JSON.stringify({ success: true, message: 'Not a Printful product' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse Printful variants
    const syncVariants = JSON.parse(order.products.printful_sync_variants || '[]')
    if (syncVariants.length === 0) {
      throw new Error('No Printful variants found for this product')
    }

    // Use the first variant (you might want to add size/color selection logic)
    const selectedVariant = syncVariants[0]

    // Create Printful order
    const printfulOrderData = {
      external_id: orderId,
      shipping: "STANDARD",
      recipient: {
        name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        address1: shippingInfo.address,
        city: shippingInfo.city,
        state_code: shippingInfo.state || '',
        country_code: shippingInfo.country?.toUpperCase() || 'US',
        zip: shippingInfo.zip,
        email: customerInfo.email,
      },
      items: [
        {
          sync_variant_id: selectedVariant.id,
          quantity: order.quantity || 1,
          retail_price: parseFloat(order.total_amount) / (order.quantity || 1)
        }
      ]
    }

    logStep("Creating Printful order", { externalId: orderId });

    const printfulResponse = await fetch('https://api.printful.com/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${printfulApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(printfulOrderData)
    })

    if (!printfulResponse.ok) {
      const errorData = await printfulResponse.json()
      throw new Error(`Printful order creation failed: ${JSON.stringify(errorData)}`)
    }

    const printfulOrderResult = await printfulResponse.json()
    logStep("Printful order created", { printfulOrderId: printfulOrderResult.result.id });

    // Update order with Printful order ID
    await supabaseClient
      .from('orders')
      .update({ 
        printful_order_id: printfulOrderResult.result.id,
        fulfillment_status: 'sent_to_printful',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    logStep("Order updated with Printful ID", { orderId });

    return new Response(
      JSON.stringify({ 
        success: true, 
        printfulOrderId: printfulOrderResult.result.id,
        message: 'Pedido enviado para a Printful com sucesso'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    logStep("ERROR in order creation", { message: error.message });
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
