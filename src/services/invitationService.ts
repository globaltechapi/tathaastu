import { supabase } from "@/lib/supabase";

export type Invitation = {
  id: string;
  registry_id: string;
  email: string;
  name: string | null;
  message: string | null;
  status: "pending" | "sent" | "viewed";
  rsvp_status: "attending" | "not_attending" | "maybe" | null;
  token: string | null;
  design_data: string | null;
  created_at: string;
  updated_at: string | null;
};

export type CreateInvitationData = {
  registry_id: string;
  email: string;
  name?: string;
  message?: string | null;
  design_data?: string | null;
};

export async function createInvitation(data: CreateInvitationData) {
  const { data: invitation, error } = await supabase
    .from("invitations")
    .insert([
      {
        ...data,
        status: "pending",
        token: generateToken(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return invitation as Invitation;
}

export async function createBulkInvitations(
  invitations: CreateInvitationData[],
) {
  const invitationsWithTokens = invitations.map((invitation) => ({
    ...invitation,
    status: "pending",
    token: generateToken(),
  }));

  const { data, error } = await supabase
    .from("invitations")
    .insert(invitationsWithTokens)
    .select();

  if (error) throw error;
  return data as Invitation[];
}

export async function getRegistryInvitations(registryId: string) {
  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("registry_id", registryId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Invitation[];
}

export async function getInvitationByToken(token: string) {
  const { data, error } = await supabase
    .from("invitations")
    .select("*, registries(*)")
    .eq("token", token)
    .single();

  if (error) throw error;
  return data;
}

export async function updateInvitationStatus(
  id: string,
  status: Invitation["status"],
) {
  const { data, error } = await supabase
    .from("invitations")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Invitation;
}

export async function updateRsvpStatus(
  token: string,
  rsvpStatus: Invitation["rsvp_status"],
) {
  const { data, error } = await supabase
    .from("invitations")
    .update({
      rsvp_status: rsvpStatus,
      status: "viewed",
      updated_at: new Date().toISOString(),
    })
    .eq("token", token)
    .select()
    .single();

  if (error) throw error;
  return data as Invitation;
}

export async function deleteInvitation(id: string) {
  const { error } = await supabase.from("invitations").delete().eq("id", id);

  if (error) throw error;
  return true;
}

// Helper function to generate a random token
function generateToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
