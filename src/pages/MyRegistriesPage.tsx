import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import {
  getUserRegistries,
  Registry,
  deleteRegistry,
} from "@/services/registryService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MyRegistriesPage() {
  const [registries, setRegistries] = useState<Registry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistries = async () => {
      try {
        const data = await getUserRegistries();
        setRegistries(data);
      } catch (err) {
        setError("Failed to load your registries");
        console.error(err);
        // For demo purposes, use mock data if API fails
        setRegistries([
          {
            id: "wedding-registry",
            title: "Rajan's Wedding Registry",
            description: "For our special day on June 15, 2024",
            occasion_type: "Wedding",
            event_date: "2024-06-15",
            created_at: "2023-12-01T10:30:00Z",
            updated_at: "2023-12-15T14:20:00Z",
            is_private: false,
            user_id: "current-user-id",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistries();
  }, []);

  const handleDeleteRegistry = async (id: string) => {
    try {
      await deleteRegistry(id);
      setRegistries(registries.filter((registry) => registry.id !== id));
    } catch (err) {
      console.error("Failed to delete registry:", err);
    }
  };

  const filteredRegistries = registries.filter((registry) =>
    registry.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading your registries...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            My Registries
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage all your gift registries in one place
          </p>
        </div>
        <Button asChild>
          <Link to="/create-registry">
            <Plus className="mr-2 h-4 w-4" />
            Create New Registry
          </Link>
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search your registries..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredRegistries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegistries.map((registry) => (
            <Card key={registry.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="line-clamp-1">
                      {registry.title}
                    </CardTitle>
                    <CardDescription>
                      {new Date(registry.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={registry.is_private ? "outline" : "secondary"}
                  >
                    {registry.is_private ? "Private" : "Public"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {registry.description || "No description provided"}
                </p>
                <div className="mt-4">
                  <Badge variant="outline">{registry.occasion_type}</Badge>
                  {registry.event_date && (
                    <Badge variant="outline" className="ml-2">
                      {new Date(registry.event_date).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link to={`/registry/${registry.id}/dashboard`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Manage
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your registry and all associated items.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteRegistry(registry.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No registries found</h2>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "Try adjusting your search"
              : "You haven't created any registries yet"}
          </p>
          <Button asChild>
            <Link to="/create-registry">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Registry
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
