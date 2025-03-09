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
    // or a third-party service like Rainforest API to get real Amazon data.
    // For this demo, we'll return mock data

    // Generate some mock products based on the query
    const mockProducts = generateMockProducts(query);

    const data = {
      success: true,
      products: mockProducts,
    };

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

// Helper function to generate mock products based on the search query
function generateMockProducts(query: string) {
  const searchTerm = query.toLowerCase();
  const products = [];

  // Categories with sample products
  const categories = {
    electronics: [
      {
        name: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
        price: 24990,
        rating: 4.7,
        reviews: 1245,
      },
      { name: "Apple AirPods Pro", price: 18990, rating: 4.5, reviews: 2341 },
      {
        name: "Samsung Galaxy S23 Ultra",
        price: 124999,
        rating: 4.6,
        reviews: 876,
      },
      {
        name: "Apple MacBook Pro 14-inch",
        price: 169900,
        rating: 4.8,
        reviews: 543,
      },
      { name: "Dell XPS 13 Laptop", price: 129990, rating: 4.4, reviews: 321 },
      {
        name: "LG C2 55-inch OLED TV",
        price: 129990,
        rating: 4.7,
        reviews: 654,
      },
      {
        name: "Bose QuietComfort Earbuds",
        price: 21990,
        rating: 4.3,
        reviews: 432,
      },
    ],
    books: [
      {
        name: "Atomic Habits by James Clear",
        price: 499,
        rating: 4.8,
        reviews: 3421,
      },
      {
        name: "The Psychology of Money by Morgan Housel",
        price: 399,
        rating: 4.6,
        reviews: 1876,
      },
      {
        name: "Ikigai: The Japanese Secret to a Long and Happy Life",
        price: 350,
        rating: 4.5,
        reviews: 2134,
      },
      {
        name: "The Alchemist by Paulo Coelho",
        price: 299,
        rating: 4.7,
        reviews: 5432,
      },
      {
        name: "Sapiens: A Brief History of Humankind",
        price: 599,
        rating: 4.7,
        reviews: 3210,
      },
    ],
    home: [
      {
        name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
        price: 8999,
        rating: 4.7,
        reviews: 876,
      },
      {
        name: "Dyson V11 Absolute Cordless Vacuum Cleaner",
        price: 52900,
        rating: 4.6,
        reviews: 543,
      },
      {
        name: "Philips Air Purifier 2000 Series",
        price: 16999,
        rating: 4.5,
        reviews: 321,
      },
      {
        name: "Coway Air Purifier with True HEPA Filter",
        price: 27990,
        rating: 4.8,
        reviews: 654,
      },
      {
        name: "Nespresso Vertuo Coffee and Espresso Machine",
        price: 19999,
        rating: 4.4,
        reviews: 432,
      },
    ],
    fashion: [
      {
        name: "Levi's Men's 511 Slim Fit Jeans",
        price: 2999,
        rating: 4.5,
        reviews: 876,
      },
      {
        name: "Nike Air Force 1 '07 Men's Shoe",
        price: 7995,
        rating: 4.8,
        reviews: 1243,
      },
      {
        name: "Fossil Gen 5 Smartwatch",
        price: 22995,
        rating: 4.3,
        reviews: 543,
      },
      {
        name: "Ray-Ban Aviator Classic Sunglasses",
        price: 9990,
        rating: 4.7,
        reviews: 876,
      },
      {
        name: "Casio G-Shock Digital Watch",
        price: 8995,
        rating: 4.6,
        reviews: 654,
      },
    ],
    toys: [
      {
        name: "LEGO Classic Large Creative Brick Box",
        price: 2999,
        rating: 4.8,
        reviews: 1243,
      },
      {
        name: "Funskool Monopoly Classic Board Game",
        price: 799,
        rating: 4.6,
        reviews: 876,
      },
      {
        name: "Nerf Elite Disruptor Blaster",
        price: 1499,
        rating: 4.5,
        reviews: 543,
      },
      {
        name: "Barbie Dreamhouse Dollhouse",
        price: 21999,
        rating: 4.7,
        reviews: 321,
      },
      {
        name: "Hot Wheels 20 Car Gift Pack",
        price: 1699,
        rating: 4.4,
        reviews: 654,
      },
    ],
  };

  // Generate random image URLs for products
  const getRandomImage = (category: string, index: number) => {
    const categoryImages = {
      electronics: [
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80",
        "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80",
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&q=80",
      ],
      books: [
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80",
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80",
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80",
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80",
      ],
      home: [
        "https://images.unsplash.com/photo-1556911220-bda9f7f7597e?w=400&q=80",
        "https://images.unsplash.com/photo-1585771724684-38269d6919f4?w=400&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80",
        "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&q=80",
        "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=400&q=80",
      ],
      fashion: [
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80",
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80",
        "https://images.unsplash.com/photo-1560243563-062bfc001d68?w=400&q=80",
        "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=400&q=80",
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80",
      ],
      toys: [
        "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&q=80",
        "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&q=80",
        "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&q=80",
        "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80",
        "https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?w=400&q=80",
      ],
    };

    const images = categoryImages[category] || categoryImages.electronics;
    return images[index % images.length];
  };

  // Find matching categories based on search term
  let matchingCategories = [];
  for (const category in categories) {
    if (category.includes(searchTerm)) {
      matchingCategories.push(category);
    } else {
      // Check if any product in the category matches the search term
      const matchingProducts = categories[category].filter((product) =>
        product.name.toLowerCase().includes(searchTerm),
      );
      if (matchingProducts.length > 0) {
        matchingCategories.push(category);
      }
    }
  }

  // If no matching categories, use all categories
  if (matchingCategories.length === 0) {
    matchingCategories = Object.keys(categories);
  }

  // Generate products from matching categories
  matchingCategories.forEach((category) => {
    const categoryProducts = categories[category];
    const matchingProducts = categoryProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm),
    );

    // If specific products match, use those; otherwise use all category products
    const productsToAdd =
      matchingProducts.length > 0 ? matchingProducts : categoryProducts;

    productsToAdd.forEach((product, index) => {
      products.push({
        id: `${category}-${index}-${Date.now()}`,
        name: product.name,
        price: product.price,
        rating: product.rating,
        reviews: product.reviews,
        image_url: getRandomImage(category, index),
        category: category,
        in_stock: Math.random() > 0.1, // 90% chance of being in stock
        prime: Math.random() > 0.3, // 70% chance of being Prime eligible
        description: `This is a great ${product.name} that you'll love. Perfect for your registry!`,
      });
    });
  });

  // Limit to 20 products and shuffle them
  return products.sort(() => Math.random() - 0.5).slice(0, 20);
}
