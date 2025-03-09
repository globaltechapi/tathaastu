import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Share2, Edit, Plus, Search, ShoppingCart, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  getRegistryById,
  getRegistryItems,
  getRegistryStats,
} from "@/services/registryService";
import { useAuth } from "@/lib/auth";

export default function RegistryDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [registry, setRegistry] = useState(null);
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    itemsPurchased: 0,
    views: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistryData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        // Fetch registry details
        try {
          const registryData = await getRegistryById(id);
          setRegistry(registryData);
        } catch (registryError) {
          console.error("Error fetching registry:", registryError);
          // For demo purposes, use a mock registry if real one fails
          setRegistry({
            id: id,
            title: "Demo Registry",
            description: "This is a demo registry",
            occasion_type: "Demo",
            created_at: new Date().toISOString(),
            user_id: user?.id || "demo-user",
            is_private: false,
            event_date: null,
            password: null,
            updated_at: new Date().toISOString(),
          });
        }

        // Fetch registry items
        try {
          const itemsData = await getRegistryItems(id);
          setItems(itemsData);
        } catch (itemsError) {
          console.error("Error fetching items:", itemsError);
          setItems([]);
        }

        // Fetch registry stats
        try {
          const statsData = await getRegistryStats(id);
          setStats(statsData);
        } catch (statsError) {
          console.error("Error fetching stats:", statsError);
          // Use items data to calculate basic stats if API fails
          setStats({
            totalItems: items.length,
            itemsPurchased: items.filter((item) => item.purchased).length,
            views: 0,
          });
        }
      } catch (err) {
        console.error("Error fetching registry data:", err);
        setError("Failed to load registry data");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistryData();
  }, [id, user?.id, items.length]);

  // Fallback to mock data if no registry data is available yet
  const registryData = registry || {
    id: id || "new-registry",
    title: "Loading Registry...",
    date: "",
    description: "Loading registry details...",
    type: "Loading",
  };

  const registryItems = items.length > 0 ? items : [];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading registry data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-6">
        <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
        <Button asChild>
          <Link to="/my-registries">Back to My Registries</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {registryData.title}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{registryData.type}</Badge>
            {registryData.event_date && (
              <p className="text-sm text-muted-foreground">
                {new Date(registryData.event_date).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/registry/${registryData.id}/invite`}>
              <Share2 className="mr-2 h-4 w-4" />
              Invite Guests
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit Details
          </Button>
          <div className="flex gap-2">
            <Button size="sm" asChild>
              <Link to={`/registry/${registryData.id}/add-item`}>
                <Plus className="mr-2 h-4 w-4" />
                Add Amazon Item
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link to={`/registry/${registryData.id}/add-manual-item`}>
                <Plus className="mr-2 h-4 w-4" />
                Add Manual Item
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Items Purchased
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.itemsPurchased}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalItems > 0
                ? Math.round((stats.itemsPurchased / stats.totalItems) * 100)
                : 0}
              %
            </div>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{
                  width: `${stats.totalItems > 0 ? (stats.itemsPurchased / stats.totalItems) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Registry Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.views}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="items" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="items">Registry Items</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Registry Items</h2>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search items..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {registryItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registryItems
                .filter((item) =>
                  item.name.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((item) => (
                  <Card
                    key={item.id}
                    className={item.purchased ? "opacity-75" : ""}
                  >
                    <div className="relative h-48 w-full">
                      <img
                        src={
                          item.image_url ||
                          "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image"
                        }
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority} Priority
                        </Badge>
                        {item.purchased && (
                          <Badge variant="secondary">Purchased</Badge>
                        )}
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">
                        {item.name}
                      </CardTitle>
                      <CardDescription>
                        ₹{item.price.toFixed(2)}
                      </CardDescription>
                    </CardHeader>
                    {item.note && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {item.note}
                        </p>
                      </CardContent>
                    )}
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={async () => {
                          try {
                            const { deleteRegistryItem } = await import(
                              "@/services/registryService"
                            );
                            await deleteRegistryItem(item.id);
                            setItems(items.filter((i) => i.id !== item.id));
                            toast({
                              title: "Item removed",
                              description: `${item.name} has been removed from your registry.`,
                            });
                          } catch (error) {
                            console.error("Error removing item:", error);
                            toast({
                              title: "Error",
                              description:
                                "Failed to remove item. Please try again.",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <h3 className="text-lg font-medium mb-2">
                No items in your registry yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start adding items to your registry
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link to={`/registry/${registryData.id}/add-item`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Amazon Item
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to={`/registry/${registryData.id}/add-manual-item`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Manual Item
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {registryItems.length > 0 && (
            <div className="mt-8 text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link to={`/registry/${registryData.id}/add-item`}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add Amazon Item
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to={`/registry/${registryData.id}/add-manual-item`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Manual Item
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                See who has viewed or purchased items from your registry.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.itemsPurchased > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {stats.itemsPurchased}{" "}
                        {stats.itemsPurchased === 1 ? "item" : "items"}{" "}
                        purchased
                      </p>
                      <p className="text-sm text-muted-foreground">Recently</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Search className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {stats.views} {stats.views === 1 ? "person" : "people"}{" "}
                        viewed your registry
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total views
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    No activity yet. Share your registry to see activity here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
