import { supabase } from "@/lib/supabase";

export type Registry = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  occasion_type: string;
  event_date: string | null;
  is_private: boolean;
  password: string | null;
  created_at: string;
  updated_at: string;
};

export type RegistryItem = {
  id: string;
  registry_id: string;
  name: string;
  price: number;
  image_url: string | null;
  priority: string;
  note: string | null;
  quantity: number;
  purchased: boolean;
  purchased_by: string | null;
  purchased_at: string | null;
  created_at: string;
};

export type RegistryView = {
  id: string;
  registry_id: string;
  viewer_id: string | null;
  viewed_at: string;
};

export type RegistryStats = {
  totalItems: number;
  itemsPurchased: number;
  views: number;
};

export type CreateRegistryData = {
  title: string;
  description?: string;
  occasion_type: string;
  event_date?: string;
  is_private: boolean;
  password?: string;
};

export type CreateRegistryItemData = {
  registry_id: string;
  name: string;
  price: number;
  image_url?: string;
  priority: string;
  note?: string;
  quantity: number;
  platform?: string;
  product_link?: string;
  variant?: string;
};

// Registry functions
export async function createRegistry(data: CreateRegistryData) {
  const { data: registry, error } = await supabase
    .from("registries")
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return registry as Registry;
}

export async function getRegistryById(id: string) {
  const { data, error } = await supabase
    .from("registries")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Registry;
}

export async function getUserRegistries() {
  const { data, error } = await supabase
    .from("registries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Registry[];
}

export async function getPublicRegistries() {
  const { data, error } = await supabase
    .from("registries")
    .select("*")
    .eq("is_private", false)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Registry[];
}

export async function updateRegistry(
  id: string,
  updates: Partial<CreateRegistryData>,
) {
  const { data, error } = await supabase
    .from("registries")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Registry;
}

export async function deleteRegistry(id: string) {
  const { error } = await supabase.from("registries").delete().eq("id", id);

  if (error) throw error;
  return true;
}

// Registry items functions
export async function createRegistryItem(data: CreateRegistryItemData) {
  const { data: item, error } = await supabase
    .from("registry_items")
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return item as RegistryItem;
}

export async function getRegistryItems(registryId: string) {
  const { data, error } = await supabase
    .from("registry_items")
    .select("*")
    .eq("registry_id", registryId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as RegistryItem[];
}

export async function updateRegistryItem(
  id: string,
  updates: Partial<CreateRegistryItemData>,
) {
  const { data, error } = await supabase
    .from("registry_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as RegistryItem;
}

export async function deleteRegistryItem(id: string) {
  const { error } = await supabase.from("registry_items").delete().eq("id", id);

  if (error) throw error;
  return true;
}

export async function markItemAsPurchased(id: string, userId: string) {
  const { data, error } = await supabase
    .from("registry_items")
    .update({
      purchased: true,
      purchased_by: userId,
      purchased_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as RegistryItem;
}

// Registry views functions
export async function recordRegistryView(registryId: string, userId?: string) {
  const { error } = await supabase.from("registry_views").insert([
    {
      registry_id: registryId,
      viewer_id: userId || null,
    },
  ]);

  if (error) throw error;
  return true;
}

export async function getRegistryStats(
  registryId: string,
): Promise<RegistryStats> {
  // Get total items
  const { data: items, error: itemsError } = await supabase
    .from("registry_items")
    .select("id, purchased")
    .eq("registry_id", registryId);

  if (itemsError) throw itemsError;

  // Get view count
  const { count, error: viewsError } = await supabase
    .from("registry_views")
    .select("id", { count: "exact" })
    .eq("registry_id", registryId);

  if (viewsError) throw viewsError;

  const totalItems = items.length;
  const itemsPurchased = items.filter((item) => item.purchased).length;

  return {
    totalItems,
    itemsPurchased,
    views: count || 0,
  };
}
