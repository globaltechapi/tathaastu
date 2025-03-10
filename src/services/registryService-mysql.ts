import { query } from "@/lib/mysql-browser";

interface RegistryData {
  title: string;
  description?: string;
  occasion?: string;
  event_date?: string;
  is_public?: boolean;
  password?: string;
  cover_image_url?: string;
  user_id: string;
}

export async function createRegistry(registryData: RegistryData) {
  try {
    const registryId = crypto.randomUUID();

    const { error } = await query(
      `INSERT INTO registries 
       (id, user_id, title, description, occasion, event_date, is_public, password, cover_image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        registryId,
        registryData.user_id,
        registryData.title,
        registryData.description || null,
        registryData.occasion || null,
        registryData.event_date || null,
        registryData.is_public !== undefined ? registryData.is_public : true,
        registryData.password || null,
        registryData.cover_image_url || null,
      ],
    );

    if (error) throw error;

    return { data: { id: registryId }, error: null };
  } catch (error) {
    console.error("Error creating registry:", error);
    return { data: null, error };
  }
}

export async function getRegistry(registryId: string) {
  try {
    const { data, error } = await query(
      `SELECT r.*, u.name as owner_name, u.email as owner_email 
       FROM registries r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.id = ?`,
      [registryId],
    );

    if (error) throw error;

    if ((data as any[]).length === 0) {
      return { data: null, error: new Error("Registry not found") };
    }

    return { data: (data as any[])[0], error: null };
  } catch (error) {
    console.error("Error fetching registry:", error);
    return { data: null, error };
  }
}

export async function getUserRegistries(userId: string) {
  try {
    const { data, error } = await query(
      `SELECT r.*, 
        (SELECT COUNT(*) FROM registry_items WHERE registry_id = r.id) as item_count,
        (SELECT COUNT(*) FROM registry_items WHERE registry_id = r.id AND purchased = true) as purchased_count
       FROM registries r 
       WHERE r.user_id = ? 
       ORDER BY r.created_at DESC`,
      [userId],
    );

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching user registries:", error);
    return { data: null, error };
  }
}

export async function updateRegistry(
  registryId: string,
  updates: Partial<RegistryData>,
) {
  try {
    // Build the SQL query dynamically based on the fields to update
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
      return { data: null, error: new Error("No fields to update") };
    }

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const sql = `UPDATE registries SET ${setClause} WHERE id = ?`;

    const { error } = await query(sql, [...values, registryId]);

    if (error) throw error;

    return { data: { id: registryId }, error: null };
  } catch (error) {
    console.error("Error updating registry:", error);
    return { data: null, error };
  }
}

export async function deleteRegistry(registryId: string) {
  try {
    // Delete registry items first (this should be handled by ON DELETE CASCADE, but just to be safe)
    await query(`DELETE FROM registry_items WHERE registry_id = ?`, [
      registryId,
    ]);

    // Delete invitations (this should be handled by ON DELETE CASCADE, but just to be safe)
    await query(`DELETE FROM invitations WHERE registry_id = ?`, [registryId]);

    // Delete the registry
    const { error } = await query(`DELETE FROM registries WHERE id = ?`, [
      registryId,
    ]);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error("Error deleting registry:", error);
    return { error };
  }
}

export async function getPublicRegistries(
  searchQuery?: string,
  occasionFilter?: string,
) {
  try {
    let sql = `
      SELECT r.*, u.name as owner_name,
        (SELECT COUNT(*) FROM registry_items WHERE registry_id = r.id) as item_count,
        (SELECT COUNT(*) FROM registry_items WHERE registry_id = r.id AND purchased = true) as purchased_count
      FROM registries r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.is_public = true
    `;

    const params: any[] = [];

    if (searchQuery) {
      sql += ` AND (r.title LIKE ? OR r.description LIKE ?)`;
      params.push(`%${searchQuery}%`, `%${searchQuery}%`);
    }

    if (occasionFilter && occasionFilter !== "All") {
      sql += ` AND r.occasion = ?`;
      params.push(occasionFilter);
    }

    sql += ` ORDER BY r.created_at DESC`;

    const { data, error } = await query(sql, params);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching public registries:", error);
    return { data: null, error };
  }
}
