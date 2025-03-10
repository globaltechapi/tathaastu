import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import {
  LayoutDashboard,
  Gift,
  ListChecks,
  Settings,
  LogOut,
  Plus,
  Calendar,
  Users,
  Bell,
  Search,
  ShoppingCart,
  Share2,
} from "lucide-react";
import { getUserRegistries } from "@/services/registryService";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  // Hide footer when dashboard is active
  useEffect(() => {
    // Hide footer
    const footer = document.querySelector("footer");
    if (footer) {
      footer.style.display = "none";
    }

    // Restore footer visibility when component unmounts
    return () => {
      if (footer) {
        footer.style.display = "";
      }
    };
  }, []);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [registries, setRegistries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user registries when component mounts
  useEffect(() => {
    const fetchRegistries = async () => {
      try {
        setLoading(true);
        const data = await getUserRegistries();
        setRegistries(data);
      } catch (error) {
        console.error("Error fetching registries:", error);
        toast({
          title: "Error",
          description: "Failed to load your registries. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRegistries();
  }, [toast]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredRegistries = registries.filter((registry) =>
    registry.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const [dashboardStats, setDashboardStats] = useState({
    totalRegistries: 0,
    totalItems: 0,
    upcomingEvents: 0,
    recentViews: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Calculate total registries
        const totalRegistries = registries.length;

        // Fetch total items across all registries
        let totalItems = 0;
        let totalViews = 0;
        const activityItems: any[] = [];
        const events: any[] = [];

        // Process each registry
        for (const registry of registries) {
          try {
            // Get items for this registry
            const { data: items } = await supabase
              .from("registry_items")
              .select("*")
              .eq("registry_id", registry.id);

            if (items) {
              totalItems += items.length;

              // Get purchased items for activity feed
              const purchasedItems = items.filter((item) => item.purchased);
              purchasedItems.forEach((item) => {
                activityItems.push({
                  id: item.id,
                  type: "purchase",
                  message: `${item.name} was purchased by ${item.purchaser_name || "Guest"}`,
                  date: item.purchased_at
                    ? formatDistanceToNow(new Date(item.purchased_at), {
                        addSuffix: true,
                      })
                    : "recently",
                  registry_title: registry.title,
                });
              });
            }

            // Get views for this registry
            const { count } = await supabase
              .from("registry_views")
              .select("id", { count: "exact" })
              .eq("registry_id", registry.id);

            if (count) {
              totalViews += count;

              // Add view activity if there are views
              if (count > 0) {
                activityItems.push({
                  id: `view-${registry.id}`,
                  type: "view",
                  message: `Your ${registry.title} was viewed by ${count} ${count === 1 ? "person" : "people"}`,
                  date: "recently",
                  registry_title: registry.title,
                });
              }
            }

            // Check if registry has an event date
            if (registry.event_date) {
              const eventDate = new Date(registry.event_date);
              const today = new Date();
              const diffTime = eventDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              // Only add upcoming events (positive days)
              if (diffDays > 0) {
                events.push({
                  id: registry.id,
                  title: registry.title,
                  date: eventDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }),
                  daysLeft: diffDays,
                });
              }
            }
          } catch (err) {
            console.error(`Error processing registry ${registry.id}:`, err);
          }
        }

        // Sort activities by date (assuming most recent first)
        activityItems.sort((a, b) => {
          if (a.date === "recently" && b.date === "recently") return 0;
          if (a.date === "recently") return -1;
          if (b.date === "recently") return 1;
          return 0; // For simplicity, keep original order for other cases
        });

        // Sort events by days left (soonest first)
        events.sort((a, b) => a.daysLeft - b.daysLeft);

        // Update state with real data
        setDashboardStats({
          totalRegistries,
          totalItems,
          upcomingEvents: events.length,
          recentViews: totalViews,
        });

        setRecentActivity(activityItems.slice(0, 5)); // Limit to 5 most recent activities
        setUpcomingEvents(events.slice(0, 3)); // Limit to 3 upcoming events
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    if (registries.length > 0) {
      fetchDashboardData();
    }
  }, [registries, user]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r bg-card">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Tathaastu
            </h2>
            <p className="text-sm text-muted-foreground mt-1">User Dashboard</p>
          </div>

          <div className="flex-1 px-4 space-y-2">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="w-full justify-start text-[0.8rem]"
              onClick={() => setActiveTab("overview")}
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Overview
            </Button>
            <Button
              variant={activeTab === "registries" ? "default" : "ghost"}
              className="w-full justify-start text-[0.8rem]"
              onClick={() => setActiveTab("registries")}
            >
              <Gift className="mr-2 h-5 w-5" />
              My Registries
            </Button>
            <Button
              variant={activeTab === "create" ? "default" : "ghost"}
              className="w-full justify-start text-[0.8rem]"
              onClick={() => setActiveTab("create")}
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Registry
            </Button>
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              className="w-full justify-start text-[0.8rem]"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-5 w-5" />
              Account Settings
            </Button>
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-medium text-primary">
                  {user?.user_metadata?.name
                    ? user.user_metadata.name.charAt(0).toUpperCase()
                    : user?.email?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="overflow-hidden">
                <p className="font-medium truncate">
                  {user?.user_metadata?.name || user?.email || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive text-[0.8rem]"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Tathaastu
          </h2>
          <Button variant="outline" size="icon" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
        <div className="grid grid-cols-4 gap-1 p-1">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            className="flex flex-col items-center justify-center h-16 rounded-none"
            onClick={() => setActiveTab("overview")}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-[0.64rem] mt-1">Overview</span>
          </Button>
          <Button
            variant={activeTab === "registries" ? "default" : "ghost"}
            className="flex flex-col items-center justify-center h-16 rounded-none"
            onClick={() => setActiveTab("registries")}
          >
            <Gift className="h-5 w-5" />
            <span className="text-[0.64rem] mt-1">Registries</span>
          </Button>
          <Button
            variant={activeTab === "create" ? "default" : "ghost"}
            className="flex flex-col items-center justify-center h-16 rounded-none"
            onClick={() => setActiveTab("create")}
          >
            <Plus className="h-5 w-5" />
            <span className="text-[0.64rem] mt-1">Create</span>
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            className="flex flex-col items-center justify-center h-16 rounded-none"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="h-5 w-5" />
            <span className="text-[0.64rem] mt-1">Account</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64 pt-4 md:pt-0">
        <div className="container mx-auto p-4 md:p-6 pb-20 md:pb-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Dashboard Overview
                </h1>
                <Button asChild>
                  <Link to="/create-registry">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Registry
                  </Link>
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Registries
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardStats.totalRegistries}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Across all occasions
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardStats.totalItems}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      In all your registries
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardStats.upcomingEvents}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      In the next 60 days
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Recent Views
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardStats.recentViews}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      In the last 7 days
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity and Upcoming Events */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest updates from your registries
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentActivity.length > 0 ? (
                      <div className="space-y-4">
                        {recentActivity.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-start gap-4 p-3 rounded-lg border"
                          >
                            <div className="bg-primary/10 p-2 rounded-full">
                              {activity.type === "purchase" && (
                                <ShoppingCart className="h-5 w-5 text-primary" />
                              )}
                              {activity.type === "view" && (
                                <Search className="h-5 w-5 text-primary" />
                              )}
                              {activity.type === "share" && (
                                <Share2 className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{activity.message}</p>
                              <p className="text-sm text-muted-foreground">
                                {activity.date}
                              </p>
                              {activity.registry_title && (
                                <Badge variant="outline" className="mt-1">
                                  {activity.registry_title}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">
                          No recent activity found. Create or share a registry
                          to see activity here.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>
                      Events linked to your registries
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {upcomingEvents.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingEvents.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-start gap-4 p-3 rounded-lg border"
                          >
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{event.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {event.date}
                              </p>
                              <Badge className="mt-2 bg-primary/10 text-primary hover:bg-primary/20">
                                {event.daysLeft} days left
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">
                          No upcoming events found. Add event dates to your
                          registries to see them here.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common tasks you might want to perform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                      asChild
                    >
                      <Link to="/create-registry">
                        <Plus className="h-6 w-6" />
                        <span>Create Registry</span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                      asChild
                    >
                      <Link to="/my-registries">
                        <Gift className="h-6 w-6" />
                        <span>View Registries</span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                      asChild
                    >
                      <Link to="/account">
                        <Settings className="h-6 w-6" />
                        <span>Account Settings</span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                      asChild
                    >
                      <Link to="/explore">
                        <Search className="h-6 w-6" />
                        <span>Explore Registries</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* My Registries Tab */}
            <TabsContent value="registries" className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    My Registries
                  </h1>
                  <p className="text-muted-foreground mt-1">
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

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4">Loading your registries...</p>
                </div>
              ) : filteredRegistries.length > 0 ? (
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
                              {new Date(
                                registry.created_at,
                              ).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge
                            variant={
                              registry.is_private ? "outline" : "secondary"
                            }
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
                          <Badge variant="outline">
                            {registry.occasion_type}
                          </Badge>
                          {registry.event_date && (
                            <Badge variant="outline" className="ml-2">
                              {new Date(
                                registry.event_date,
                              ).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" asChild>
                          <Link to={`/registry/${registry.id}/dashboard`}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Manage
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link to={`/registry/${registry.id}`}>
                            <Search className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">
                    No registries found
                  </h2>
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
            </TabsContent>

            {/* Create Registry Tab */}
            <TabsContent value="create" className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Create New Registry
                </h1>
              </div>
              <p className="text-muted-foreground">
                Create a new gift registry for any occasion. Fill in the details
                below to get started.
              </p>
              <div className="flex justify-center">
                <Button size="lg" asChild>
                  <Link to="/create-registry">
                    <Plus className="mr-2 h-5 w-5" />
                    Start Creating Registry
                  </Link>
                </Button>
              </div>
            </TabsContent>

            {/* Account Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Account Settings
                </h1>
              </div>
              <p className="text-muted-foreground">
                Manage your account settings, profile information, and
                preferences.
              </p>
              <div className="flex justify-center">
                <Button size="lg" asChild>
                  <Link to="/account">
                    <Settings className="mr-2 h-5 w-5" />
                    Go to Account Settings
                  </Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
