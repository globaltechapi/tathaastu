import { query } from "@/lib/mysql-browser";

interface InvitationData {
  registry_id: string;
  recipient_email?: string;
  recipient_name?: string;
  message?: string;
  template_id?: string;
}

export async function createInvitation(invitationData: InvitationData) {
  try {
    const invitationId = crypto.randomUUID();
    const token = generateToken();

    const { error } = await query(
      `INSERT INTO invitations 
       (id, registry_id, token, recipient_email, recipient_name, message, template_id, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        invitationId,
        invitationData.registry_id,
        token,
        invitationData.recipient_email || null,
        invitationData.recipient_name || null,
        invitationData.message || null,
        invitationData.template_id || null,
        "sent",
      ],
    );

    if (error) throw error;

    return { data: { id: invitationId, token }, error: null };
  } catch (error) {
    console.error("Error creating invitation:", error);
    return { data: null, error };
  }
}

export async function getInvitationByToken(token: string) {
  try {
    const { data, error } = await query(
      `SELECT i.*, r.title as registry_title, r.id as registry_id, u.name as registry_owner_name 
       FROM invitations i 
       JOIN registries r ON i.registry_id = r.id 
       JOIN users u ON r.user_id = u.id 
       WHERE i.token = ?`,
      [token],
    );

    if (error) throw error;

    if ((data as any[]).length === 0) {
      return { data: null, error: new Error("Invitation not found") };
    }

    return { data: (data as any[])[0], error: null };
  } catch (error) {
    console.error("Error fetching invitation:", error);
    return { data: null, error };
  }
}

export async function getRegistryInvitations(registryId: string) {
  try {
    const { data, error } = await query(
      `SELECT * FROM invitations WHERE registry_id = ? ORDER BY created_at DESC`,
      [registryId],
    );

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching registry invitations:", error);
    return { data: null, error };
  }
}

export async function updateInvitationStatus(
  invitationId: string,
  status: string,
) {
  try {
    const { error } = await query(
      `UPDATE invitations SET status = ? WHERE id = ?`,
      [status, invitationId],
    );

    if (error) throw error;

    return { data: { id: invitationId }, error: null };
  } catch (error) {
    console.error("Error updating invitation status:", error);
    return { data: null, error };
  }
}

// Helper function to generate a random token
function generateToken(length = 32) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
