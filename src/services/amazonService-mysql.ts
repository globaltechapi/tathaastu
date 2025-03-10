import { query } from "@/lib/mysql-browser";

export interface AmazonProduct {
  id: string;
  name: string;
  price: number;
  image_url: string;
  rating: number;
  reviews: number;
  description?: string;
  category?: string;
  in_stock?: boolean;
  prime?: boolean;
}

export async function searchAmazonProducts(
  searchQuery: string,
): Promise<AmazonProduct[]> {
  try {
    // This would typically call an API, but we'll use mock data for now
    return getMockAmazonProducts(searchQuery);
  } catch (error) {
    console.error("Error searching Amazon products:", error);
    return [];
  }
}

export async function addAmazonProductToRegistry(
  product: AmazonProduct,
  registryId: string,
  priority: string = "Medium",
  note: string = "",
) {
  try {
    const itemId = crypto.randomUUID();

    const { error } = await query(
      `INSERT INTO registry_items 
       (id, registry_id, name, price, image_url, priority, note, quantity, platform, product_link, purchased) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        itemId,
        registryId,
        product.name,
        product.price,
        product.image_url,
        priority,
        note || null,
        1,
        "Amazon",
        `https://amazon.in/dp/${product.id}`,
        false,
      ],
    );

    if (error) throw error;

    return { id: itemId };
  } catch (error) {
    console.error("Error adding Amazon product to registry:", error);
    throw error;
  }
}

// Mock function to generate Amazon products
function getMockAmazonProducts(query: string): AmazonProduct[] {
  const searchTerm = query.toLowerCase();

  const mockProducts = [
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
