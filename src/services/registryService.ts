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
  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Only fetch registries belonging to the current user
  const { data, error } = await supabase
    .from("registries")
    .select("*")
    .eq("user_id", user.id)
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
  try {
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

    if (error) {
      console.error("Error marking item as purchased:", error);
      throw error;
    }
    return data as RegistryItem;
  } catch (error) {
    console.error("Error in markItemAsPurchased:", error);
    throw error;
  }
}

export async function markItemAsPurchasedWithDetails(
  id: string,
  userId: string,
  purchaserName: string,
  purchaserEmail: string,
  purchaserMessage?: string,
) {
  try {
    // Get the registry_id first to use in our cache invalidation
    const { data: itemData } = await supabase
      .from("registry_items")
      .select("registry_id")
      .eq("id", id)
      .single();

    const registryId = itemData?.registry_id;
    const timestamp = new Date().toISOString();

    // Try to use the stored procedure if available
    const { data: funcData, error: funcError } = await supabase.rpc(
      "mark_item_as_purchased",
      {
        item_id: id,
        user_id: userId,
        p_name: purchaserName,
        p_email: purchaserEmail,
      },
    );

    if (!funcError) {
      // Invalidate cache by touching another item in the registry
      if (registryId) {
        try {
          const { data: otherItems } = await supabase
            .from("registry_items")
            .select("id")
            .eq("registry_id", registryId)
            .neq("id", id)
            .limit(1);

          if (otherItems && otherItems.length > 0) {
            await supabase
              .from("registry_items")
              .update({ updated_at: timestamp })
              .eq("id", otherItems[0].id);
          }
        } catch (cacheError) {
          console.warn("Cache invalidation error:", cacheError);
        }
      }

      return funcData;
    }

    // Fall back to regular update if the function isn't available
    const { data, error } = await supabase
      .from("registry_items")
      .update({
        purchased: true,
        purchased_by: userId,
        purchased_at: timestamp,
        purchaser_name: purchaserName,
        purchaser_email: purchaserEmail,
        purchaser_message: purchaserMessage,
        updated_at: timestamp,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error marking item as purchased with details:", error);
      throw error;
    }

    // Make a second attempt with a slight delay to ensure the data is properly saved
    // This helps address potential race conditions or sync issues
    setTimeout(async () => {
      try {
        await supabase
          .from("registry_items")
          .update({
            purchased: true,
            purchased_by: userId,
            purchased_at: timestamp,
            purchaser_name: purchaserName,
            purchaser_email: purchaserEmail,
            updated_at: new Date().toISOString(), // Use a new timestamp to force update
          })
          .eq("id", id);

        // Invalidate cache by touching another item in the registry
        if (registryId) {
          const { data: otherItems } = await supabase
            .from("registry_items")
            .select("id")
            .eq("registry_id", registryId)
            .neq("id", id)
            .limit(1);

          if (otherItems && otherItems.length > 0) {
            await supabase
              .from("registry_items")
              .update({ updated_at: new Date().toISOString() })
              .eq("id", otherItems[0].id);
          }
        }
      } catch (retryError) {
        console.warn("Retry update had an error, but continuing:", retryError);
      }
    }, 1000);

    return data as RegistryItem;
  } catch (error) {
    console.error("Error in markItemAsPurchasedWithDetails:", error);
    throw error;
  }
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

// Get reservations (purchased items with purchaser details)
export async function getRegistryReservations(registryId: string) {
  try {
    // First try to use the registry_activity view
    try {
      const { data: activityData, error: activityError } = await supabase
        .from("registry_activity")
        .select("*")
        .eq("registry_id", registryId)
        .order("purchased_at", { ascending: false });

      if (!activityError && activityData && activityData.length > 0) {
        console.log("Using registry_activity view:", activityData);
        return activityData;
      }
    } catch (viewError) {
      console.log(
        "Registry activity view error, falling back to direct query:",
        viewError,
      );
    }

    // Fall back to direct query
    const { data, error } = await supabase
      .from("registry_items")
      .select(
        "id, registry_id, name as item_name, purchased_at, purchased_by, purchaser_name, purchaser_email, purchased",
      )
      .eq("registry_id", registryId)
      .eq("purchased", true)
      .order("purchased_at", { ascending: false });

    if (error) throw error;

    // If no data found, try refreshing the cache
    if (!data || data.length === 0) {
      // Force a cache refresh by making a dummy update to a registry item
      try {
        const { data: firstItem } = await supabase
          .from("registry_items")
          .select("id")
          .eq("registry_id", registryId)
          .limit(1)
          .single();

        if (firstItem) {
          // Touch the item to refresh cache
          await supabase
            .from("registry_items")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", firstItem.id);

          // Try fetching again
          const { data: refreshedData } = await supabase
            .from("registry_items")
            .select(
              "id, registry_id, name as item_name, purchased_at, purchased_by, purchaser_name, purchaser_email",
            )
            .eq("registry_id", registryId)
            .eq("purchased", true)
            .order("purchased_at", { ascending: false });

          if (refreshedData && refreshedData.length > 0) {
            return refreshedData.map((item) => ({
              ...item,
              purchaser_name: item.purchaser_name || "Guest",
              purchaser_email: item.purchaser_email || "guest@example.com",
            }));
          }
        }
      } catch (refreshError) {
        console.error("Error refreshing cache:", refreshError);
      }
    }

    // Process the data we have
    if (data && data.length > 0) {
      // If purchaser_name is not directly available, try to get it from the users table
      if (!data[0].purchaser_name) {
        // Get user details for purchased_by IDs
        const userIds = data
          .map((item) => item.purchased_by)
          .filter((id) => id);

        if (userIds.length > 0) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id, name, email")
            .in("id", userIds);

          if (!userError && userData) {
            // Map user data to reservations
            return data.map((item) => {
              const user = userData.find((u) => u.id === item.purchased_by);
              return {
                ...item,
                purchaser_name: item.purchaser_name || user?.name || "Guest",
                purchaser_email:
                  item.purchaser_email || user?.email || "guest@example.com",
              };
            });
          }
        }
      }

      return data.map((item) => ({
        ...item,
        purchaser_name: item.purchaser_name || "Guest",
        purchaser_email: item.purchaser_email || "guest@example.com",
      }));
    }

    // Check localStorage for any reserved items as a fallback
    try {
      const reservedItems = JSON.parse(
        localStorage.getItem("reservedItems") || "{}",
      );
      const reservedItemsArray = Object.values(reservedItems);

      if (reservedItemsArray.length > 0) {
        // Filter for items in this registry
        const { data: registryItems } = await supabase
          .from("registry_items")
          .select("id, name")
          .eq("registry_id", registryId);

        if (registryItems) {
          const matchingReservations = [];
          for (const item of registryItems) {
            if (reservedItems[item.id]) {
              matchingReservations.push({
                id: item.id,
                registry_id: registryId,
                item_name: item.name,
                purchased_at: reservedItems[item.id].timestamp,
                purchased_by: reservedItems[item.id].purchased_by,
                purchaser_name: reservedItems[item.id].purchaser_name,
                purchaser_email: reservedItems[item.id].purchaser_email,
              });
            }
          }

          if (matchingReservations.length > 0) {
            return matchingReservations;
          }
        }
      }
    } catch (localStorageError) {
      console.error("Error reading from localStorage:", localStorageError);
    }

    // Return empty array if no data found
    return [];
  } catch (error) {
    console.error("Error fetching reservations:", error);
    // Return empty array instead of mock data
    return [];
  }
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
