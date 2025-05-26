
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SYNC-PRINTFUL] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    logStep("Starting Printful product sync");

    const printfulApiKey = Deno.env.get('PRINTFUL_API_KEY')
    if (!printfulApiKey) {
      throw new Error('Printful API key not configured')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get auth token for admin verification
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header provided')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token)
    if (userError || !userData.user) {
      throw new Error('User not authenticated')
    }

    logStep("User authenticated", { userId: userData.user.id });

    // Fetch products from Printful
    const printfulResponse = await fetch('https://api.printful.com/store/products', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${printfulApiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!printfulResponse.ok) {
      throw new Error(`Printful API error: ${printfulResponse.statusText}`)
    }

    const printfulData = await printfulResponse.json()
    logStep("Fetched products from Printful", { count: printfulData.result?.length || 0 });

    const syncedProducts = []

    // Process each Printful product
    for (const printfulProduct of printfulData.result || []) {
      try {
        // Get detailed product info
        const detailResponse = await fetch(`https://api.printful.com/store/products/${printfulProduct.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${printfulApiKey}`,
            'Content-Type': 'application/json',
          },
        })

        if (!detailResponse.ok) continue

        const detailData = await detailResponse.json()
        const productDetail = detailData.result

        // Find the artist based on product name or create default
        let artistId = null
        const { data: artists } = await supabaseClient
          .from('artists')
          .select('id, name')
          .limit(1)

        if (artists && artists.length > 0) {
          artistId = artists[0].id
        }

        // Check if product already exists
        const { data: existingProduct } = await supabaseClient
          .from('products')
          .select('id')
          .eq('printful_product_id', printfulProduct.id)
          .single()

        const productData = {
          title: productDetail.sync_product.name,
          description: productDetail.sync_product.name,
          price: productDetail.sync_variants?.[0]?.retail_price || 39.99,
          image_url: productDetail.sync_variants?.[0]?.files?.[0]?.preview_url || '',
          artist_id: artistId,
          printful_product_id: printfulProduct.id,
          printful_sync_variants: JSON.stringify(productDetail.sync_variants || []),
          category: 'printful',
          is_printful_product: true,
        }

        if (existingProduct) {
          // Update existing product
          const { error: updateError } = await supabaseClient
            .from('products')
            .update(productData)
            .eq('id', existingProduct.id)

          if (!updateError) {
            syncedProducts.push({ ...productData, id: existingProduct.id, action: 'updated' })
          }
        } else {
          // Create new product
          const { data: newProduct, error: insertError } = await supabaseClient
            .from('products')
            .insert([productData])
            .select()
            .single()

          if (!insertError && newProduct) {
            syncedProducts.push({ ...newProduct, action: 'created' })
          }
        }

        logStep("Processed product", { 
          name: productDetail.sync_product.name, 
          printfulId: printfulProduct.id 
        });

      } catch (productError) {
        logStep("Error processing individual product", { 
          productId: printfulProduct.id, 
          error: productError.message 
        });
        continue
      }
    }

    logStep("Sync completed", { syncedCount: syncedProducts.length });

    return new Response(
      JSON.stringify({ 
        success: true, 
        syncedProducts,
        message: `Sincronizados ${syncedProducts.length} produtos da Printful`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    logStep("ERROR in sync", { message: error.message });
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
