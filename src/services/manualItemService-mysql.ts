import { query } from "@/lib/mysql-browser";

interface ManualItemData {
  registry_id: string;
  name: string;
  price: number;
  image_url: string | null;
  priority: string;
  note: string | null;
  quantity: number;
}

export async function addManualItem(itemData: ManualItemData) {
  try {
    const itemId = crypto.randomUUID();

    const { error } = await query(
      `INSERT INTO registry_items 
       (id, registry_id, name, price, image_url, priority, note, quantity, platform, purchased) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        itemId,
        itemData.registry_id,
        itemData.name,
        itemData.price,
        itemData.image_url,
        itemData.priority,
        itemData.note,
        itemData.quantity,
        "Manual",
        false,
      ],
    );

    if (error) throw error;

    return { data: { id: itemId }, error: null };
  } catch (error) {
    console.error("Error adding manual item:", error);
    return { data: null, error };
  }
}

export async function getRegistryItems(registryId: string) {
  try {
    const { data, error } = await query(
      `SELECT * FROM registry_items WHERE registry_id = ? ORDER BY created_at DESC`,
      [registryId],
    );

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching registry items:", error);
    return { data: null, error };
  }
}

export async function updateItem(
  itemId: string,
  updates: Partial<ManualItemData>,
) {
  try {
    // Build the SQL query dynamically based on the fields to update
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
      return { data: null, error: new Error("No fields to update") };
    }

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const sql = `UPDATE registry_items SET ${setClause} WHERE id = ?`;

    const { error } = await query(sql, [...values, itemId]);

    if (error) throw error;

    return { data: { id: itemId }, error: null };
  } catch (error) {
    console.error("Error updating item:", error);
    return { data: null, error };
  }
}

export async function deleteItem(itemId: string) {
  try {
    const { error } = await query(`DELETE FROM registry_items WHERE id = ?`, [
      itemId,
    ]);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error("Error deleting item:", error);
    return { error };
  }
}
