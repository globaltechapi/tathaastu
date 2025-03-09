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
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Gift, Calendar, User } from "lucide-react";
import {
  getInvitationByToken,
  updateRsvpStatus,
} from "@/services/invitationService";
import { useToast } from "@/components/ui/use-toast";

export default function ViewInvitationPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invitation, setInvitation] = useState<any>(null);
  const [registry, setRegistry] = useState<any>(null);
  const [rsvpStatus, setRsvpStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const data = await getInvitationByToken(token);
        setInvitation(data);
        setRegistry(data.registries);
        setRsvpStatus(data.rsvp_status);
      } catch (err) {
        console.error("Error fetching invitation:", err);
        setError("Invalid or expired invitation link");
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [token]);

  const handleRsvpSubmit = async () => {
    if (!token || !rsvpStatus) return;

    try {
      setSubmitting(true);
      await updateRsvpStatus(token, rsvpStatus as any);
      toast({
        title: "RSVP Submitted",
        description: "Thank you for your response!",
      });
    } catch (err) {
      console.error("Error submitting RSVP:", err);
      toast({
        title: "Failed to submit RSVP",
        description:
          err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading invitation...</p>
      </div>
    );
  }

  if (error || !invitation || !registry) {
    return (
      <div className="container mx-auto py-12 px-6 text-center">
        <Card>
          <CardHeader>
            <CardTitle>Invitation Error</CardTitle>
            <CardDescription>
              {error || "This invitation link is invalid or has expired"}
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button onClick={() => navigate("/")}>Return to Home</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Gift className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">You're Invited!</CardTitle>
            <CardDescription className="text-lg mt-2">
              {invitation.name || "Someone"} has invited you to view their gift
              registry
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{registry.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{registry.occasion_type}</Badge>
                {registry.event_date && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(registry.event_date).toLocaleDateString()}
                  </div>
                )}
              </div>
              {registry.description && (
                <p className="text-muted-foreground">{registry.description}</p>
              )}
            </div>

            {invitation.message && (
              <div className="border-l-4 border-primary/20 pl-4 italic text-muted-foreground">
                "{invitation.message}"
              </div>
            )}

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold">Will you attend?</h3>
              <RadioGroup
                value={rsvpStatus || ""}
                onValueChange={setRsvpStatus}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="attending" id="attending" />
                  <Label htmlFor="attending">Yes, I'll be there</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maybe" id="maybe" />
                  <Label htmlFor="maybe">Maybe</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not_attending" id="not_attending" />
                  <Label htmlFor="not_attending">No, I can't make it</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            <Button
              className="w-full"
              onClick={handleRsvpSubmit}
              disabled={submitting || !rsvpStatus}
            >
              {submitting ? "Submitting..." : "Submit RSVP"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate(`/registry/${registry.id}`)}
            >
              View Gift Registry
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
