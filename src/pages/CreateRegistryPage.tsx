import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useAuth } from "@/lib/auth";
import { createRegistry } from "@/services/registryService";

const occasionTypes = [
  "Wedding",
  "Baby Shower",
  "Birthday",
  "Anniversary",
  "Graduation",
  "Housewarming",
  "Holiday",
  "Other",
];

export default function CreateRegistryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [occasionType, setOccasionType] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!user) throw new Error("You must be logged in to create a registry");

      const registryData = {
        user_id: user.id,
        title,
        description: description || null,
        occasion_type: occasionType,
        event_date: date ? date.toISOString() : null,
        is_private: isPrivate,
        password: isPasswordProtected ? password : null,
      };

      const registry = await createRegistry(registryData);
      navigate(`/registry/${registry.id}/dashboard`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create registry",
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight mb-6">
          Create Your Registry
        </h1>
        <p className="text-muted-foreground mb-8">
          Fill out the details below to create your personalized gift registry.
        </p>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Registry Details</CardTitle>
              <CardDescription>
                Provide basic information about your registry.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="registry-name">Registry Name</Label>
                <Input
                  id="registry-name"
                  placeholder="e.g., Sarah & Michael's Wedding Registry"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occasion-type">Occasion Type</Label>
                <Select
                  value={occasionType}
                  onValueChange={setOccasionType}
                  required
                >
                  <SelectTrigger id="occasion-type">
                    <SelectValue placeholder="Select occasion type" />
                  </SelectTrigger>
                  <SelectContent>
                    {occasionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-date">Event Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="event-date"
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell your guests about your registry and the occasion"
                  className="min-h-[120px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-6 pt-4 border-t">
                <CardTitle className="text-lg">Privacy Settings</CardTitle>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="private-registry">Private Registry</Label>
                    <p className="text-sm text-muted-foreground">
                      Only people with the link can view your registry
                    </p>
                  </div>
                  <Switch
                    id="private-registry"
                    checked={isPrivate}
                    onCheckedChange={setIsPrivate}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="password-protection">
                      Password Protection
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Require a password to view your registry
                    </p>
                  </div>
                  <Switch
                    id="password-protection"
                    checked={isPasswordProtected}
                    onCheckedChange={setIsPasswordProtected}
                  />
                </div>

                {isPasswordProtected && (
                  <div className="space-y-2">
                    <Label htmlFor="registry-password">Registry Password</Label>
                    <Input
                      id="registry-password"
                      type="password"
                      placeholder="Enter a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={isPasswordProtected}
                    />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Registry"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
