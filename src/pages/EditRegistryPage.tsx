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
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getRegistryById, updateRegistry } from "@/services/registryService";
import { useAuth } from "@/lib/auth";

export default function EditRegistryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    occasion_type: "",
    event_date: "",
    is_private: false,
    password: "",
  });

  useEffect(() => {
    const fetchRegistry = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const registryData = await getRegistryById(id);

        // Format the date for the input field (YYYY-MM-DD)
        let formattedDate = "";
        if (registryData.event_date) {
          const date = new Date(registryData.event_date);
          formattedDate = date.toISOString().split("T")[0];
        }

        setFormData({
          title: registryData.title || "",
          description: registryData.description || "",
          occasion_type: registryData.occasion_type || "",
          event_date: formattedDate,
          is_private: registryData.is_private || false,
          password: registryData.password || "",
        });
      } catch (error) {
        console.error("Error fetching registry:", error);
        toast({
          title: "Error",
          description: "Failed to load registry details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRegistry();
  }, [id, toast]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) return;

    try {
      setSaving(true);
      await updateRegistry(id, formData);
      toast({
        title: "Success",
        description: "Registry details updated successfully.",
      });
      navigate(`/registry/${id}/dashboard`);
    } catch (error) {
      console.error("Error updating registry:", error);
      toast({
        title: "Error",
        description: "Failed to update registry details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading registry details...</p>
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

      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Registry Details</CardTitle>
            <CardDescription>
              Update the information for your gift registry
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Registry Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a title for your registry"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add a description for your registry"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occasion_type">Occasion Type</Label>
                <select
                  id="occasion_type"
                  name="occasion_type"
                  value={formData.occasion_type}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select an occasion</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Baby Shower">Baby Shower</option>
                  <option value="Housewarming">Housewarming</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Graduation">Graduation</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_date">Event Date (Optional)</Label>
                <Input
                  id="event_date"
                  name="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_private"
                  name="is_private"
                  checked={formData.is_private}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_private: checked })
                  }
                />
                <Label htmlFor="is_private">Make this registry private</Label>
              </div>

              {formData.is_private && (
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password (Optional, for private registries)
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Set a password for your private registry"
                  />
                  <p className="text-sm text-muted-foreground">
                    If set, viewers will need this password to access your
                    registry
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
