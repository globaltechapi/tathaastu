import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, Trash2, Send, Check } from "lucide-react";
import { getRegistryById } from "@/services/registryService";
import {
  createBulkInvitations,
  getRegistryInvitations,
  Invitation,
  deleteInvitation,
} from "@/services/invitationService";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export default function InviteGuestsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [registry, setRegistry] = useState(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for adding guests
  const [guestEmails, setGuestEmails] = useState("");
  const [message, setMessage] = useState(
    "I've created a gift registry and would love for you to check it out!",
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        // Fetch registry details
        const registryData = await getRegistryById(id);
        setRegistry(registryData);

        // Fetch existing invitations
        const invitationsData = await getRegistryInvitations(id);
        setInvitations(invitationsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load registry data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSendInvitations = async () => {
    if (!id || !guestEmails.trim()) return;

    try {
      setSending(true);

      // Parse emails (comma or newline separated)
      const emails = guestEmails
        .split(/[,\n]/) // Split by comma or newline
        .map((email) => email.trim())
        .filter((email) => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)); // Basic email validation

      if (emails.length === 0) {
        toast({
          title: "Invalid emails",
          description: "Please enter valid email addresses",
          variant: "destructive",
        });
        return;
      }

      // Create invitation objects
      const invitationsToCreate = emails.map((email) => ({
        registry_id: id,
        email,
        message: message || null,
      }));

      // Send invitations
      const newInvitations = await createBulkInvitations(invitationsToCreate);

      // Send email notifications for each invitation
      for (const invitation of newInvitations) {
        try {
          await supabase.functions.invoke("send-invitation", {
            body: { invitationId: invitation.id },
          });
        } catch (error) {
          console.error("Error sending invitation email:", error);
        }
      }

      // Update local state
      setInvitations((prev) => [...newInvitations, ...prev]);
      setGuestEmails("");

      toast({
        title: "Invitations created",
        description: `Successfully created ${newInvitations.length} invitation${newInvitations.length !== 1 ? "s" : ""}. In this demo, emails are simulated and not actually sent.`,
      });
    } catch (err) {
      console.error("Error sending invitations:", err);
      toast({
        title: "Failed to send invitations",
        description:
          err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleDeleteInvitation = async (invitationId: string) => {
    try {
      await deleteInvitation(invitationId);
      setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
      toast({
        title: "Invitation deleted",
        description: "The invitation has been removed",
      });
    } catch (err) {
      console.error("Error deleting invitation:", err);
      toast({
        title: "Failed to delete invitation",
        description:
          err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const getRsvpStatusBadge = (status: Invitation["rsvp_status"]) => {
    if (!status) return null;

    switch (status) {
      case "attending":
        return <Badge className="bg-green-100 text-green-800">Attending</Badge>;
      case "not_attending":
        return <Badge className="bg-red-100 text-red-800">Not Attending</Badge>;
      case "maybe":
        return <Badge className="bg-yellow-100 text-yellow-800">Maybe</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-6">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(`/registry/${id}/dashboard`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Registry
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-semibold tracking-tight mb-6">
            Invite Guests
          </h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create Invitations</CardTitle>
              <CardDescription>
                Invite friends and family to view your registry (Demo: emails
                are simulated)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emails">Guest Emails</Label>
                <Textarea
                  id="emails"
                  placeholder="Enter email addresses (separated by commas or new lines)"
                  value={guestEmails}
                  onChange={(e) => setGuestEmails(e.target.value)}
                  className="min-h-[100px]"
                />
                <p className="text-sm text-muted-foreground">
                  Example: friend@example.com, family@example.com
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Personal Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a personal message to your invitation"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSendInvitations}
                disabled={sending || !guestEmails.trim()}
                className="w-full"
              >
                <Send className="mr-2 h-4 w-4" />
                {sending ? "Creating..." : "Create Invitations"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Invitation Status</CardTitle>
              <CardDescription>
                Track who has viewed your registry
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invitations.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-start justify-between border-b pb-3"
                    >
                      <div>
                        <p className="font-medium">{invitation.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">
                            {invitation.status === "pending" && "Pending"}
                            {invitation.status === "sent" && "Sent"}
                            {invitation.status === "viewed" && "Viewed"}
                          </Badge>
                          {getRsvpStatusBadge(invitation.rsvp_status)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteInvitation(invitation.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    No invitations sent yet
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                {invitations.length} invitation
                {invitations.length !== 1 ? "s" : ""}
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
