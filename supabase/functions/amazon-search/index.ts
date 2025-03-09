// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/deploy/docs/supabase-edge-functions

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    if (!query) {
      throw new Error("Search query is required");
    }

    // In a real implementation, this would call the Amazon Product Advertising API
    // or a third-party service like Rainforest API to get real Amazon data
    // For this demo, we'll return mock data based on the search query

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const products = getMockProductsForQuery(query);

    return new Response(
      JSON.stringify({
        success: true,
        products,
        query,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

// Helper function to generate mock products based on search query
function getMockProductsForQuery(query: string) {
  const lowerQuery = query.toLowerCase();

  // Generate a unique ID based on the product name
  const generateId = (name: string) => {
    return (
      name.toLowerCase().replace(/[^a-z0-9]/g, "-") +
      "-" +
      Date.now().toString().slice(-4)
    );
  };

  // Sample products for different categories
  if (lowerQuery.includes("toy") || lowerQuery.includes("game")) {
    return [
      {
        id: generateId("Funskool Monopoly"),
        name: "Funskool Monopoly Classic Board Game",
        price: 499,
        image:
          "https://images.unsplash.com/photo-1611371805429-8b5c1f0536fc?w=400&q=80",
        rating: 4.7,
        reviews: 3254,
      },
      {
        id: generateId("Lego Classic"),
        name: "Lego Classic Creative Brick Box Building Set",
        price: 1999,
        image:
          "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80",
        rating: 4.9,
        reviews: 8721,
      },
      {
        id: generateId("Nerf Elite"),
        name: "Nerf Elite Disruptor Blaster",
        price: 799,
        image:
          "https://images.unsplash.com/photo-1563396983906-b3795482a59a?w=400&q=80",
        rating: 4.5,
        reviews: 2145,
      },
      {
        id: generateId("Mattel Barbie"),
        name: "Mattel Barbie Dreamhouse Playset",
        price: 3999,
        image:
          "https://images.unsplash.com/photo-1558679928-be7e02981a07?w=400&q=80",
        rating: 4.6,
        reviews: 1876,
      },
    ];
  } else if (
    lowerQuery.includes("electronics") ||
    lowerQuery.includes("phone") ||
    lowerQuery.includes("laptop")
  ) {
    return [
      {
        id: generateId("Samsung Galaxy"),
        name: "Samsung Galaxy M34 5G (8GB, 128GB)",
        price: 18999,
        image:
          "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80",
        rating: 4.3,
        reviews: 7823,
      },
      {
        id: generateId("HP Laptop"),
        name: "HP 15s Thin & Light Laptop (11th Gen i5)",
        price: 54990,
        image:
          "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80",
        rating: 4.2,
        reviews: 3421,
      },
      {
        id: generateId("boAt Headphones"),
        name: "boAt Rockerz 450 Bluetooth Headphone",
        price: 1499,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
        rating: 4.4,
        reviews: 12543,
      },
    ];
  } else if (
    lowerQuery.includes("kitchen") ||
    lowerQuery.includes("appliance")
  ) {
    return [
      {
        id: generateId("Prestige Rice Cooker"),
        name: "Prestige Electric Rice Cooker (1.8 Litre)",
        price: 2499,
        image:
          "https://images.unsplash.com/photo-1544233726-9f1d0a5f2830?w=400&q=80",
        rating: 4.5,
        reviews: 8546,
      },
      {
        id: generateId("Bajaj Mixer"),
        name: "Bajaj Mixer Grinder with 3 Jars",
        price: 1995,
        image:
          "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80",
        rating: 4.3,
        reviews: 6723,
      },
      {
        id: generateId("Philips Air Fryer"),
        name: "Philips Air Fryer HD9252/90",
        price: 7999,
        image:
          "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400&q=80",
        rating: 4.7,
        reviews: 5238,
      },
    ];
  } else {
    // Default products for any other search
    return [
      {
        id: generateId(`${query} Premium`),
        name: `${query} - Premium Quality Product`,
        price: 1299,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
        rating: 4.2,
        reviews: 2723,
      },
      {
        id: generateId(`${query} Best Selling`),
        name: `Best Selling ${query} on Amazon.in`,
        price: 2499,
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
        rating: 4.5,
        reviews: 8546,
      },
      {
        id: generateId(`${query} New Model`),
        name: `${query} - New 2023 Model`,
        price: 3999,
        image:
          "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",
        rating: 4.7,
        reviews: 5238,
      },
    ];
  }
}
