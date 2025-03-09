// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/deploy/docs/supabase-edge-functions

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { invitationId } = await req.json();

    if (!invitationId) {
      throw new Error("Invitation ID is required");
    }

    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    // Get the invitation details
    const { data: invitation, error: invitationError } = await supabaseClient
      .from("invitations")
      .select("*, registries(title, id)")
      .eq("id", invitationId)
      .single();

    if (invitationError) {
      throw invitationError;
    }

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    // Update invitation status to 'sent'
    const { error: updateError } = await supabaseClient
      .from("invitations")
      .update({ status: "sent", updated_at: new Date().toISOString() })
      .eq("id", invitationId);

    if (updateError) {
      throw updateError;
    }

    // In a real application, you would send an email here
    // For this demo, we'll just simulate it
    const invitationUrl = `${req.headers.get("origin")}/invitation/${invitation.token}`;
    const registryTitle = invitation.registries.title;
    const registryId = invitation.registries.id;
    const registryUrl = `${req.headers.get("origin")}/registry/${registryId}`;

    // Return the invitation details and URLs that would be included in the email
    const data = {
      success: true,
      message: "Invitation sent successfully",
      details: {
        to: invitation.email,
        subject: `You're invited to view a gift registry: ${registryTitle}`,
        invitationUrl,
        registryUrl,
        message: invitation.message || "Please check out my gift registry!",
      },
    };

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
