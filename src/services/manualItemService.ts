import { supabase } from "@/lib/supabase";

export async function addManualItem(itemData: any) {
  try {
    // Use the registryService instead of direct Supabase calls
    const { createRegistryItem } = await import("./registryService");
    const data = await createRegistryItem(itemData);
    return { data, error: null };
  } catch (error) {
    console.error("Error in addManualItem:", error);
    return { data: null, error };
  }
}
