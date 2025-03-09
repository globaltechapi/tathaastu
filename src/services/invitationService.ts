import { supabase } from "@/lib/supabase";

export type Invitation = {
  id: string;
  registry_id: string;
  email: string;
  name: string | null;
  status: "pending" | "sent" | "viewed";
  rsvp_status: "attending" | "not_attending" | "maybe" | null;
  message: string | null;
  created_at: string;
  updated_at: string;
  token: string;
};

export type CreateInvitationData = {
  registry_id: string;
  email: string;
  name?: string;
  message?: string;
};

export async function createInvitation(data: CreateInvitationData) {
  const { data: invitation, error } = await supabase
    .from("invitations")
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return invitation as Invitation;
}

export async function createBulkInvitations(
  invitations: CreateInvitationData[],
) {
  const { data, error } = await supabase
    .from("invitations")
    .insert(invitations)
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
