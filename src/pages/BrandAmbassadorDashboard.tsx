import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import {
  Award,
  Gift,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Plus,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function BrandAmbassadorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [ambassadorData, setAmbassadorData] = useState({
    name: user?.user_metadata?.name || "Brand Ambassador",
    joinDate: "June 15, 2023",
    registriesCreated: 12,
    totalDonations: 156,
    impactScore: 87,
    kitStatus: "Delivered",
    upcomingEvents: [
      {
        id: "event1",
        title: "Orphanage Visit - Sunshine Home",
        date: "July 25, 2023",
        type: "Visit",
      },
      {
        id: "event2",
        title: "Donation Drive - Elderly Care",
        date: "August 5, 2023",
        type: "Drive",
      },
    ],
    managedRegistries: [
      {
        id: "reg1",
        title: "Sunshine Orphanage",
        items: 42,
        purchased: 28,
        type: "Orphanage",
        lastUpdated: "2 days ago",
      },
      {
        id: "reg2",
        title: "Golden Years Elderly Home",
        items: 36,
        purchased: 22,
        type: "Elderly Home",
        lastUpdated: "5 days ago",
      },
      {
        id: "reg3",
        title: "Hope Foundation",
        items: 24,
        purchased: 18,
        type: "NGO",
        lastUpdated: "1 week ago",
      },
    ],
    recentActivities: [
      {
        id: "act1",
        description: "Added 5 new items to Sunshine Orphanage registry",
        time: "2 days ago",
        type: "update",
      },
      {
        id: "act2",
        description:
          "3 items purchased from Golden Years Elderly Home registry",
        time: "3 days ago",
        type: "purchase",
      },
      {
        id: "act3",
        description: "Created new registry for Hope Foundation",
        time: "1 week ago",
        type: "create",
      },
      {
        id: "act4",
        description:
          "Shared Golden Years Elderly Home registry with 15 contacts",
        time: "1 week ago",
        type: "share",
      },
      {
        id: "act5",
        description: "Received Ambassador Kit",
        time: "3 weeks ago",
        type: "kit",
      },
    ],
  });

  useEffect(() => {
    // Simulate API call to fetch ambassador data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-primary/20 to-purple-500/20 py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Welcome, {ambassadorData.name}!
              </h1>
              <p className="text-muted-foreground">
                Brand Ambassador since {ambassadorData.joinDate}
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link to="/create-registry">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Registry
                </Link>
              </Button>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto py-12 px-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">
                  Registries Created
                </CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {ambassadorData.registriesCreated}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +3 this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">
                  Total Donations
                </CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {ambassadorData.totalDonations}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +28 this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">
                  Impact Score
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {ambassadorData.impactScore}/100
              </div>
              <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${ambassadorData.impactScore}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">
                  Ambassador Kit
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-lg font-medium">
                  {ambassadorData.kitStatus}
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800 hover:bg-green-100"
                >
                  ✓
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Shipped on June 18, 2023
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="registries" className="w-full">
          <TabsList className="grid w-full md:w-[600px] grid-cols-3">
            <TabsTrigger value="registries">Managed Registries</TabsTrigger>
            <TabsTrigger value="activities">Recent Activities</TabsTrigger>
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
          </TabsList>

          {/* Registries Tab */}
          <TabsContent value="registries" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Managed Registries</h2>
              <Button asChild>
                <Link to="/create-registry">
                  <Plus className="mr-2 h-4 w-4" />
                  New Registry
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ambassadorData.managedRegistries.map((registry) => (
                <Card
                  key={registry.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {registry.title}
                      </CardTitle>
                      <Badge variant="outline">{registry.type}</Badge>
                    </div>
                    <CardDescription>
                      Last updated {registry.lastUpdated}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>{registry.items} items</span>
                      <span>{registry.purchased} purchased</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${(registry.purchased / registry.items) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/registry/${registry.id}/dashboard`}>
                        Manage
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/registry/${registry.id}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              {/* Create New Registry Card */}
              <Card className="border-dashed hover:border-primary/50 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center p-6">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Create New Registry
                </h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Set up a new registry for an organization in your community
                </p>
                <Button asChild>
                  <Link to="/create-registry">Get Started</Link>
                </Button>
              </Card>
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Activities</h2>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-8">
                  {ambassadorData.recentActivities.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="relative pl-6 pb-8 last:pb-0"
                    >
                      {/* Timeline connector */}
                      {index < ambassadorData.recentActivities.length - 1 && (
                        <div className="absolute left-2 top-2 bottom-0 w-px bg-border"></div>
                      )}

                      {/* Activity dot */}
                      <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary"></div>

                      {/* Activity content */}
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Upcoming Events</h2>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Event
              </Button>
            </div>

            {ambassadorData.upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ambassadorData.upcomingEvents.map((event) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                      <CardDescription>{event.date}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="ghost" size="sm">
                        Add to Calendar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    No upcoming events scheduled
                  </p>
                  <Button className="mt-4">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Event
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Recognition Section */}
        <div className="mt-12 bg-muted/30 p-6 rounded-lg">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Your Impact Recognition
              </h2>
              <p className="text-muted-foreground">
                You're making a real difference in your community!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium">Silver Impact Tier</p>
                <p className="text-sm text-muted-foreground">
                  13 points to Gold Tier
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
