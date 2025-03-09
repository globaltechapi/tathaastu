import { supabase } from "@/lib/supabase";

// Product type definition
export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
};

/**
 * Search for products on Amazon.in
 *
 * In a real implementation, this would call the Amazon Product Advertising API
 * or a third-party service like Rainforest API to get real Amazon data.
 *
 * For this demo, we're using a Supabase Edge Function as a proxy to handle the API calls.
 */
export async function searchAmazonProducts(query: string): Promise<Product[]> {
  try {
    // Call our Supabase Edge Function that would handle the Amazon API call
    const { data, error } = await supabase.functions.invoke("amazon-search", {
      body: { query },
    });

    if (error) throw error;

    return data.products;
  } catch (error) {
    console.error("Error searching Amazon products:", error);
    throw error;
  }
}
