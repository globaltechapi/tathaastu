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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Trash2, Send, Check, Palette } from "lucide-react";
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
import InvitationDesigner from "@/components/invitations/InvitationDesigner";

// Helper function to generate a shareable token
function generateShareToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

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
  const [invitationDesign, setInvitationDesign] = useState<any>(null);

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

      // Create invitation objects with design data if available
      const invitationsToCreate = emails.map((email) => ({
        registry_id: id,
        email,
        message: message || null,
        design_data: invitationDesign ? JSON.stringify(invitationDesign) : null,
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

          <Tabs defaultValue="basic">
            <TabsList className="w-full">
              <TabsTrigger value="basic">Basic Invitation</TabsTrigger>
              <TabsTrigger value="design">Design Invitation</TabsTrigger>
              <TabsTrigger value="link">Shareable Link</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Create Invitations</CardTitle>
                  <CardDescription>
                    Invite friends and family to view your registry (Demo:
                    emails are simulated)
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
            </TabsContent>

            <TabsContent value="design">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Design Beautiful Invitations</CardTitle>
                  <CardDescription>
                    Create custom invitation designs to share with your registry
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Invitation Design</Label>
                    <InvitationDesigner
                      registryTitle={registry?.title || "Gift Registry"}
                      registryDate={
                        registry?.event_date
                          ? new Date(registry.event_date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )
                          : undefined
                      }
                      onSaveDesign={setInvitationDesign}
                    />
                  </div>

                  <Separator />

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
                    <Label htmlFor="message">
                      Additional Message (Optional)
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Add an additional message to your invitation"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleSendInvitations}
                    disabled={
                      sending || !guestEmails.trim() || !invitationDesign
                    }
                    className="w-full"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {sending ? "Creating..." : "Send Designed Invitations"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="link">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Generate Shareable Link</CardTitle>
                  <CardDescription>
                    Create a link that can be shared with guests whose email
                    addresses are not available
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-md">
                    <p className="text-sm">
                      This link can be shared via messaging apps, social media,
                      or any other platform. Anyone with this link can view your
                      registry.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 p-3 border rounded-md bg-card">
                    <Input
                      readOnly
                      value={`${window.location.origin}/registry/${id}`}
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/registry/${id}`,
                        );
                        toast({
                          title: "Link copied",
                          description:
                            "The shareable link has been copied to your clipboard",
                        });
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          width="14"
                          height="14"
                          x="8"
                          y="8"
                          rx="2"
                          ry="2"
                        />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                    </Button>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">
                      Share directly:
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const url = `https://wa.me/?text=${encodeURIComponent(`Check out my gift registry: ${registry?.title || "Gift Registry"} - ${window.location.origin}/registry/${id}`)}`;
                          window.open(url, "_blank");
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                          <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Zm0 0a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                        </svg>
                        WhatsApp
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const url = `https://telegram.me/share/url?url=${encodeURIComponent(`${window.location.origin}/registry/${id}`)}&text=${encodeURIComponent(`Check out my gift registry: ${registry?.title || "Gift Registry"}!`)}`;
                          window.open(url, "_blank");
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <path d="M21.5 15.5 12 22 2.5 15.5" />
                          <path d="m22 8-10 6.5L2 8" />
                          <path d="m2 8 10-5 10 5" />
                        </svg>
                        Telegram
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const url = `mailto:?subject=${encodeURIComponent(`Check out my ${registry?.occasion_type || ""} registry: ${registry?.title || "Gift Registry"}`)}&body=${encodeURIComponent(`I've created a gift registry${registry?.event_date ? ` for ${new Date(registry.event_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}` : ""} and would love for you to check it out: ${window.location.origin}/registry/${id}${registry?.description ? `\n\n${registry.description}` : ""}`)}`;
                          window.open(url, "_blank");
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        Email
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
