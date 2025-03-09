import { supabase } from "@/lib/supabase";

export type AmazonProduct = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  rating: number;
  reviews: number;
  category: string;
  in_stock: boolean;
  prime: boolean;
  description: string;
};

export async function searchAmazonProducts(
  query: string,
): Promise<AmazonProduct[]> {
  try {
    // Call the Supabase Edge Function for Amazon product search
    const { data, error } = await supabase.functions.invoke("amazon-search", {
      body: { query },
    });

    if (error) {
      console.error("Error searching Amazon products:", error);
      throw error;
    }

    return data.products as AmazonProduct[];
  } catch (error) {
    console.error("Error in searchAmazonProducts:", error);
    // Return mock data as fallback
    return getMockAmazonProducts(query);
  }
}

// Fallback function to generate mock products if the edge function fails
function getMockAmazonProducts(query: string): AmazonProduct[] {
  const searchTerm = query.toLowerCase();

  const mockProducts: AmazonProduct[] = [
    {
      id: "electronics-1",
      name: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
      price: 24990,
      image_url:
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80",
      rating: 4.7,
      reviews: 1245,
      category: "electronics",
      in_stock: true,
      prime: true,
      description:
        "Industry-leading noise cancellation with Dual Noise Sensor technology",
    },
    {
      id: "electronics-2",
      name: "Apple AirPods Pro",
      price: 18990,
      image_url:
        "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80",
      rating: 4.5,
      reviews: 2341,
      category: "electronics",
      in_stock: true,
      prime: true,
      description: "Active Noise Cancellation for immersive sound",
    },
    {
      id: "home-1",
      name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
      price: 8999,
      image_url:
        "https://images.unsplash.com/photo-1585771724684-38269d6919f4?w=400&q=80",
      rating: 4.7,
      reviews: 876,
      category: "home",
      in_stock: true,
      prime: true,
      description:
        "7-in-1 appliance: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker and warmer",
    },
    {
      id: "books-1",
      name: "Atomic Habits by James Clear",
      price: 499,
      image_url:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80",
      rating: 4.8,
      reviews: 3421,
      category: "books",
      in_stock: true,
      prime: true,
      description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    },
    {
      id: "fashion-1",
      name: "Levi's Men's 511 Slim Fit Jeans",
      price: 2999,
      image_url:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80",
      rating: 4.5,
      reviews: 876,
      category: "fashion",
      in_stock: true,
      prime: false,
      description: "Sits below waist, slim through hip and thigh, slim leg",
    },
  ];

  // Filter products based on search term
  return mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm),
  );
}

export async function addAmazonProductToRegistry(
  productData: any,
  registryId: string,
  priority: string,
  note?: string,
) {
  try {
    const { createRegistryItem } = await import("./registryService");

    // Format the product data for the registry item
    const registryItemData = {
      registry_id: registryId,
      name: productData.name,
      price: productData.price,
      image_url: productData.image_url,
      priority: priority,
      note: note || null,
      quantity: 1,
      platform: "amazon",
      product_link: `https://www.amazon.in/dp/${productData.id}`,
      variant: null,
    };

    const newItem = await createRegistryItem(registryItemData);
    return newItem;
  } catch (error) {
    console.error("Error adding Amazon product to registry:", error);
    throw error;
  }
}
