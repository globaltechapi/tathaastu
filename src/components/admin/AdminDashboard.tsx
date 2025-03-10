import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import {
  BarChart3,
  Users,
  Gift,
  Settings,
  RefreshCw,
  Search,
  FileText,
  Image,
  CreditCard,
  Home,
  LogOut,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Lock,
  Unlock,
  Plus,
  Award,
  Globe,
  Layout,
  Palette,
  Code,
  Layers,
  Tag,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Save,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState<any[]>([]);
  const [registries, setRegistries] = useState<any[]>([]);
  const [ambassadors, setAmbassadors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserStatus, setUpdatingUserStatus] = useState<{
    [key: string]: boolean;
  }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);

  // Website content settings
  const [siteSettings, setSiteSettings] = useState(() => {
    // Try to load settings from localStorage first
    const savedSettings = localStorage.getItem("siteSettings");
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (e) {
        console.error("Error parsing saved settings:", e);
      }
    }

    // Default settings if nothing in localStorage
    return {
      siteName: "Tathaastu",
      siteTagline: "Gift Registry for Every Occasion",
      siteDescription:
        "Create and share your gift registry with friends and family",
      logoUrl:
        "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=100&q=80",
      faviconUrl: "/favicon.ico",
      primaryColor: "#6366f1",
      secondaryColor: "#8b5cf6",
      metaTitle: "Tathaastu - Gift Registry Platform",
      metaDescription:
        "Create and manage gift registries for any occasion with Tathaastu",
      metaKeywords:
        "gift registry, wedding registry, birthday registry, baby shower",
      footerText: "© 2024 Tathaastu. All rights reserved.",
      contactEmail: "support@tathaastu.com",
      contactPhone: "+91 9876543210",
      contactAddress:
        "123 Tech Park, Electronic City\nBangalore, Karnataka 560100\nIndia",
      socialLinks: {
        facebook: "https://facebook.com/tathaastu",
        instagram: "https://instagram.com/tathaastu",
        twitter: "https://twitter.com/tathaastu",
        linkedin: "https://linkedin.com/company/tathaastu",
      },
    };
  });

  // Payment gateway settings
  const [paymentSettings, setPaymentSettings] = useState(() => {
    // Try to load settings from localStorage first
    const savedSettings = localStorage.getItem("siteSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.paymentSettings) {
          return parsed.paymentSettings;
        }
      } catch (e) {
        console.error("Error parsing saved payment settings:", e);
      }
    }

    // Default settings if nothing in localStorage
    return {
      razorpayKeyId: "rzp_test_1DP5mmOlF5G5ag",
      razorpayKeySecret: "*************",
      currency: "INR",
      enablePayments: true,
      ambassadorPrice: 1999,
    };
  });

  // Page content settings
  const [pageContent, setPageContent] = useState({
    home: {
      heroTitle: "Tathaastu: Gift Registry for Every Occasion",
      heroSubtitle:
        "Create and share your gift registry with friends and family",
      heroImage:
        "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1200&q=80",
      featuresTitle: "Features that make gift-giving easier",
      featuresDescription:
        "Our platform makes it easy to create and manage your gift registry with powerful features.",
    },
    about: {
      title: "About Tathaastu",
      content:
        "Tathaastu is a platform that helps you create and manage gift registries for any occasion.",
      teamMembers:
        "Founder: Rahul Sharma\nCTO: Priya Patel\nHead of Operations: Amit Kumar",
    },
    howItWorks: {
      title: "How Tathaastu Works",
      content:
        "Learn how to create and share your gift registry with Tathaastu.",
    },
    contact: {
      title: "Contact Us",
      content: "Get in touch with us for any questions or feedback.",
    },
    brandAmbassador: {
      title: "Become a Tathaastu Brand Ambassador",
      description:
        "Create meaningful impact in your community by connecting donors with those who need it most.",
    },
    testimonials: {
      title: "What Our Users Say",
      description: "Hear from people who have used our platform",
      items: [
        {
          id: "1",
          name: "Priya Sharma",
          role: "Bride",
          content:
            "Tathaastu made our wedding registry so easy to manage. Our guests loved the simplicity!",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
          rating: 5,
        },
        {
          id: "2",
          name: "Rahul Verma",
          role: "NGO Director",
          content:
            "We've been able to connect donors with children who need school supplies. This platform is a game-changer.",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
          rating: 5,
        },
        {
          id: "3",
          name: "Ananya Patel",
          role: "Birthday Girl",
          content:
            "I created a registry for my 30th birthday and directed gifts to my favorite charity. Everyone found it so thoughtful!",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
          rating: 4,
        },
      ],
    },
  });

  // Hide footer when admin dashboard is active
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch users
        try {
          const { data: userData } = await supabase.from("users").select("*");
          setUsers(userData || []);
        } catch (error) {
          console.error("Error fetching users:", error);
          setUsers([]);
        }

        // Fetch registries
        try {
          const { data: registryData } = await supabase
            .from("registries")
            .select("*");
          setRegistries(registryData || []);
        } catch (error) {
          console.error("Error fetching registries:", error);
          setRegistries([]);
        }

        // Fetch brand ambassadors
        try {
          const { data: ambassadorData } = await supabase
            .from("brand_ambassadors")
            .select("*");
          setAmbassadors(ambassadorData || []);
        } catch (error) {
          console.error("Error fetching ambassadors:", error);
          setAmbassadors([]);
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const handleEditUser = (user: any) => {
    try {
      // Create a deep copy of the user object to avoid reference issues
      setSelectedUser(JSON.parse(JSON.stringify(user)));
      setUserDialogOpen(true);
    } catch (error) {
      console.error("Error preparing user for edit:", error);
      toast({
        title: "Error",
        description: "Failed to open edit dialog. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      try {
        const { error } = await supabase
          .from("users")
          .delete()
          .eq("id", userId);

        if (error) throw error;

        setUsers(users.filter((user) => user.id !== userId));
        toast({
          title: "User deleted",
          description: "The user has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting user:", error);
        toast({
          title: "Error",
          description: "Failed to delete user. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveUser = async () => {
    try {
      setIsUpdatingUser(true);

      const { error } = await supabase
        .from("users")
        .update({
          name: selectedUser.name,
          email: selectedUser.email,
          is_super_admin: selectedUser.is_super_admin,
        })
        .eq("id", selectedUser.id);

      if (error) throw error;

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? selectedUser : user,
        ),
      );

      setUserDialogOpen(false);
      toast({
        title: "User updated",
        description: "The user has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingUser(false);
    }
  };

  const handleSaveSiteSettings = () => {
    try {
      // Store settings in localStorage for persistence
      localStorage.setItem("siteSettings", JSON.stringify(siteSettings));

      // Dispatch a storage event to notify other components
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "siteSettings",
          newValue: JSON.stringify(siteSettings),
        }),
      );

      toast({
        title: "Settings saved",
        description: "Website settings have been successfully updated.",
      });
    } catch (error) {
      console.error("Error saving site settings:", error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSavePaymentSettings = () => {
    try {
      // Store settings in localStorage for persistence
      const existingSettings = localStorage.getItem("siteSettings");
      const settings = existingSettings ? JSON.parse(existingSettings) : {};
      settings.paymentSettings = paymentSettings;
      localStorage.setItem("siteSettings", JSON.stringify(settings));

      // Dispatch a storage event to notify other components
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "siteSettings",
          newValue: JSON.stringify(settings),
        }),
      );

      toast({
        title: "Payment settings updated",
        description: "Payment gateway settings have been successfully updated.",
      });
    } catch (error) {
      console.error("Error saving payment settings:", error);
      toast({
        title: "Error",
        description: "Failed to update payment settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSavePageContent = (page: string) => {
    // In a real app, you would save this to a database
    toast({
      title: "Content updated",
      description: `${page} page content has been successfully updated.`,
    });
  };

  const filteredUsers = searchQuery
    ? users.filter(
        (user) =>
          (user.name?.toLowerCase() || "").includes(
            searchQuery.toLowerCase(),
          ) ||
          (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()),
      )
    : users;

  const filteredAmbassadors = searchQuery
    ? ambassadors.filter(
        (ambassador) =>
          (ambassador.name?.toLowerCase() || "").includes(
            searchQuery.toLowerCase(),
          ) ||
          (ambassador.email?.toLowerCase() || "").includes(
            searchQuery.toLowerCase(),
          ) ||
          (ambassador.phone?.toLowerCase() || "").includes(
            searchQuery.toLowerCase(),
          ),
      )
    : ambassadors;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r bg-card">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Tathaastu
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Super Admin Panel
            </p>
          </div>

          <div className="flex-1 px-4 space-y-2">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("users")}
            >
              <Users className="mr-2 h-5 w-5" />
              User Management
            </Button>
            <Button
              variant={activeTab === "ambassadors" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("ambassadors")}
            >
              <Award className="mr-2 h-5 w-5" />
              Brand Ambassadors
            </Button>
            <Button
              variant={activeTab === "content" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("content")}
            >
              <FileText className="mr-2 h-5 w-5" />
              Content Management
            </Button>
            <Button
              variant={activeTab === "appearance" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("appearance")}
            >
              <Palette className="mr-2 h-5 w-5" />
              Appearance
            </Button>
            <Button
              variant={activeTab === "media" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("media")}
            >
              <Image className="mr-2 h-5 w-5" />
              Media Library
            </Button>
            <Button
              variant={activeTab === "payments" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("payments")}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Payment Settings
            </Button>
            <Button
              variant={activeTab === "seo" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("seo")}
            >
              <Globe className="mr-2 h-5 w-5" />
              SEO Settings
            </Button>
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-5 w-5" />
              System Settings
            </Button>
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-medium text-primary">
                  {user?.user_metadata?.name
                    ? user.user_metadata.name.charAt(0).toUpperCase()
                    : user?.email?.charAt(0).toUpperCase() || "A"}
                </span>
              </div>
              <div className="overflow-hidden">
                <p className="font-medium truncate">
                  {user?.user_metadata?.name || user?.email || "Admin"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Button variant="outline" asChild className="justify-start">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  View Website
                </Link>
              </Button>
              <Button
                variant="outline"
                className="justify-start text-destructive hover:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Tathaastu Admin
          </h2>
          <Button variant="outline" size="icon" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
        <div className="grid grid-cols-5 gap-1 p-1">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            className="flex flex-col items-center justify-center h-16 rounded-none"
            onClick={() => setActiveTab("overview")}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </Button>
          <Button
            variant={activeTab === "users" ? "default" : "ghost"}
            className="flex flex-col items-center justify-center h-16 rounded-none"
            onClick={() => setActiveTab("users")}
          >
            <Users className="h-5 w-5" />
            <span className="text-xs mt-1">Users</span>
          </Button>
          <Button
            variant={activeTab === "content" ? "default" : "ghost"}
            className="flex flex-col items-center justify-center h-16 rounded-none"
            onClick={() => setActiveTab("content")}
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs mt-1">Content</span>
          </Button>
          <Button
            variant={activeTab === "appearance" ? "default" : "ghost"}
            className="flex flex-col items-center justify-center h-16 rounded-none"
            onClick={() => setActiveTab("appearance")}
          >
            <Palette className="h-5 w-5" />
            <span className="text-xs mt-1">Design</span>
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            className="flex flex-col items-center justify-center h-16 rounded-none"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
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
            <TabsContent value="overview" className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Admin Dashboard
                </h1>
                <Button variant="outline" size="sm" className="gap-1">
                  <RefreshCw className="h-4 w-4" />
                  Refresh Data
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{users.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Registered accounts
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Registries
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {registries.length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Active gift registries
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Brand Ambassadors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {ambassadors.length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Active ambassadors
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">
                      Online
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      All systems operational
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>System Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-medium mb-2">Recent Activity</h3>
                        <div className="space-y-2">
                          <p className="text-sm">
                            • New user registered (10 minutes ago)
                          </p>
                          <p className="text-sm">
                            • New registry created (2 hours ago)
                          </p>
                          <p className="text-sm">
                            • System backup completed (6 hours ago)
                          </p>
                        </div>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-medium mb-2">System Health</h3>
                        <div className="space-y-2">
                          <p className="text-sm">
                            • Database:{" "}
                            <span className="text-green-500">Healthy</span>
                          </p>
                          <p className="text-sm">
                            • Storage:{" "}
                            <span className="text-green-500">
                              72% Available
                            </span>
                          </p>
                          <p className="text-sm">
                            • API Services:{" "}
                            <span className="text-green-500">
                              All Operational
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                      onClick={() => setActiveTab("content")}
                    >
                      <FileText className="h-6 w-6" />
                      <span>Edit Content</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                      onClick={() => setActiveTab("appearance")}
                    >
                      <Palette className="h-6 w-6" />
                      <span>Change Appearance</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                      onClick={() => setActiveTab("users")}
                    >
                      <Users className="h-6 w-6" />
                      <span>Manage Users</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                      onClick={() => setActiveTab("payments")}
                    >
                      <CreditCard className="h-6 w-6" />
                      <span>Payment Settings</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              {/* User Edit Dialog */}
              {selectedUser && (
                <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit User</DialogTitle>
                      <DialogDescription>
                        Update user information and permissions
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Name</Label>
                        <Input
                          id="edit-name"
                          value={selectedUser.name || ""}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                          id="edit-email"
                          type="email"
                          value={selectedUser.email || ""}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is-admin"
                          checked={selectedUser.is_super_admin || false}
                          onCheckedChange={(checked) =>
                            setSelectedUser({
                              ...selectedUser,
                              is_super_admin: checked,
                            })
                          }
                        />
                        <Label htmlFor="is-admin">Super Admin Privileges</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setUserDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveUser}
                        disabled={isUpdatingUser}
                      >
                        {isUpdatingUser ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    User Management
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Manage all users registered on the platform
                  </p>
                </div>
                <Button>
                  <Users className="mr-2 h-4 w-4" />
                  Add New User
                </Button>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="relative max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-8 w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead>
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              Name
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              Email
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              Role
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              Joined
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              Status
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <tr>
                              <td colSpan={6} className="p-4 text-center">
                                <div className="flex justify-center">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                </div>
                              </td>
                            </tr>
                          ) : filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                              <tr
                                key={user.id}
                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                              >
                                <td className="p-4 align-middle">
                                  {user.name || "(No name)"}
                                </td>
                                <td className="p-4 align-middle">
                                  {user.email}
                                </td>
                                <td className="p-4 align-middle">
                                  {user.is_super_admin ? (
                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 border-blue-200">
                                      Admin
                                    </span>
                                  ) : user.is_ambassador ? (
                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 border-purple-200">
                                      Ambassador
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 border-green-200">
                                      User
                                    </span>
                                  )}
                                </td>
                                <td className="p-4 align-middle">
                                  {new Date(
                                    user.created_at,
                                  ).toLocaleDateString()}
                                </td>
                                <td className="p-4 align-middle">
                                  <div className="flex items-center">
                                    <Switch
                                      checked={!user.disabled}
                                      disabled={updatingUserStatus[user.id]}
                                      onCheckedChange={async (checked) => {
                                        try {
                                          // Set loading state for this specific user
                                          setUpdatingUserStatus((prev) => ({
                                            ...prev,
                                            [user.id]: true,
                                          }));

                                          // First update local state for immediate UI feedback
                                          setUsers(
                                            users.map((u) =>
                                              u.id === user.id
                                                ? { ...u, disabled: !checked }
                                                : u,
                                            ),
                                          );

                                          // First check if the user and disabled column exist
                                          try {
                                            // Check user status first
                                            const {
                                              data: userData,
                                              error: checkError,
                                            } = await supabase.functions.invoke(
                                              "check-user-status",
                                              {
                                                body: { user_id: user.id },
                                              },
                                            );

                                            console.log(
                                              "User data check:",
                                              userData,
                                            );

                                            // Try the direct SQL update function
                                            const { data, error } =
                                              await supabase.rpc(
                                                "direct_sql_update_user_status",
                                                {
                                                  p_user_id: user.id,
                                                  p_disabled: !checked,
                                                },
                                              );

                                            console.log("RPC update result:", {
                                              data,
                                              error,
                                            });

                                            if (error) {
                                              console.error(
                                                "RPC error:",
                                                error,
                                              );

                                              // Try edge function as fallback
                                              try {
                                                const {
                                                  data: edgeData,
                                                  error: edgeError,
                                                } =
                                                  await supabase.functions.invoke(
                                                    "update-user-status",
                                                    {
                                                      body: {
                                                        user_id: user.id,
                                                        disabled: !checked,
                                                      },
                                                    },
                                                  );

                                                console.log(
                                                  "Edge function result:",
                                                  { edgeData, edgeError },
                                                );

                                                if (edgeError) {
                                                  console.error(
                                                    "Edge function error:",
                                                    edgeError,
                                                  );
                                                  // All methods failed, revert UI state
                                                  setUsers(
                                                    users.map((u) =>
                                                      u.id === user.id
                                                        ? {
                                                            ...u,
                                                            disabled:
                                                              user.disabled,
                                                          }
                                                        : u,
                                                    ),
                                                  );
                                                  throw edgeError;
                                                }
                                              } catch (fallbackError) {
                                                console.error(
                                                  "Fallback error:",
                                                  fallbackError,
                                                );
                                                throw fallbackError;
                                              }
                                            }
                                          } catch (error) {
                                            console.error(
                                              "Error updating user status:",
                                              error,
                                            );
                                            throw error;
                                          }

                                          toast({
                                            title: checked
                                              ? "User Enabled"
                                              : "User Disabled",
                                            description: `${user.name || user.email} has been ${checked ? "enabled" : "disabled"}.`,
                                          });
                                        } catch (error) {
                                          console.error(
                                            "Error updating user status:",
                                            error,
                                          );
                                          toast({
                                            title: "Error",
                                            description:
                                              "Failed to update user status. Please try again.",
                                            variant: "destructive",
                                          });
                                        } finally {
                                          // Clear loading state
                                          setUpdatingUserStatus((prev) => ({
                                            ...prev,
                                            [user.id]: false,
                                          }));
                                        }
                                      }}
                                    />
                                    {updatingUserStatus[user.id] && (
                                      <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4 align-middle">
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEditUser(user)}
                                    >
                                      <Edit className="h-4 w-4 mr-1" />
                                      Edit
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-destructive"
                                      onClick={() => handleDeleteUser(user.id)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={6}
                                className="p-4 text-center text-muted-foreground"
                              >
                                No users found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ambassadors" className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Brand Ambassadors
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Manage brand ambassadors and their subscriptions
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Ambassador
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Ambassador List</CardTitle>
                    <CardDescription>
                      All registered brand ambassadors
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="rounded-md border">
                      <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                          <thead>
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                              <th className="h-12 px-4 text-left align-middle font-medium">
                                Name
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium">
                                Email
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium">
                                Phone
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium">
                                Status
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium">
                                Joined
                              </th>
                              <th className="h-12 px-4 text-left align-middle font-medium">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <tr>
                                <td colSpan={6} className="p-4 text-center">
                                  <div className="flex justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                  </div>
                                </td>
                              </tr>
                            ) : filteredAmbassadors.length > 0 ? (
                              filteredAmbassadors.map((ambassador) => (
                                <tr
                                  key={ambassador.id}
                                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                >
                                  <td className="p-4 align-middle">
                                    {ambassador.name ||
                                      ambassador.users?.name ||
                                      "(No name)"}
                                  </td>
                                  <td className="p-4 align-middle">
                                    {ambassador.email ||
                                      ambassador.users?.email}
                                  </td>
                                  <td className="p-4 align-middle">
                                    {ambassador.phone || "N/A"}
                                  </td>
                                  <td className="p-4 align-middle">
                                    <Badge
                                      variant="outline"
                                      className={
                                        ambassador.status === "active"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-yellow-100 text-yellow-800"
                                      }
                                    >
                                      {ambassador.status || "Pending"}
                                    </Badge>
                                  </td>
                                  <td className="p-4 align-middle">
                                    {new Date(
                                      ambassador.joined_date ||
                                        ambassador.created_at,
                                    ).toLocaleDateString()}
                                  </td>
                                  <td className="p-4 align-middle">
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          // Create a deep copy to avoid reference issues
                                          const ambassadorCopy = JSON.parse(
                                            JSON.stringify(ambassador),
                                          );
                                          setSelectedUser(ambassadorCopy);
                                          setUserDialogOpen(true);
                                          toast({
                                            title: "Edit Ambassador",
                                            description:
                                              "You can now edit the ambassador details.",
                                          });
                                        }}
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-destructive"
                                        onClick={async () => {
                                          try {
                                            // Set loading state
                                            setUpdatingUserStatus({
                                              ...updatingUserStatus,
                                              [ambassador.id]: true,
                                            });

                                            // Update ambassador status
                                            const { error } = await supabase
                                              .from("brand_ambassadors")
                                              .update({
                                                status:
                                                  ambassador.status === "active"
                                                    ? "disabled"
                                                    : "active",
                                              })
                                              .eq("id", ambassador.id);

                                            if (error) throw error;

                                            // Update local state
                                            setAmbassadors(
                                              ambassadors.map((amb) =>
                                                amb.id === ambassador.id
                                                  ? {
                                                      ...amb,
                                                      status:
                                                        amb.status === "active"
                                                          ? "disabled"
                                                          : "active",
                                                    }
                                                  : amb,
                                              ),
                                            );

                                            toast({
                                              title:
                                                ambassador.status === "active"
                                                  ? "Ambassador Disabled"
                                                  : "Ambassador Activated",
                                              description: `${ambassador.name || ambassador.email} has been ${ambassador.status === "active" ? "disabled" : "activated"}.`,
                                            });
                                          } catch (error) {
                                            console.error(
                                              "Error updating ambassador status:",
                                              error,
                                            );
                                            toast({
                                              title: "Error",
                                              description:
                                                "Failed to update ambassador status. Please try again.",
                                              variant: "destructive",
                                            });
                                          } finally {
                                            setUpdatingUserStatus({
                                              ...updatingUserStatus,
                                              [ambassador.id]: false,
                                            });
                                          }
                                        }}
                                      >
                                        {updatingUserStatus[ambassador.id] ? (
                                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent"></div>
                                        ) : null}
                                        {ambassador.status === "active"
                                          ? "Disable"
                                          : "Enable"}
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={6}
                                  className="p-4 text-center text-muted-foreground"
                                >
                                  No brand ambassadors found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Enrollment Settings</CardTitle>
                    <CardDescription>
                      Configure brand ambassador program settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="enrollment-price">
                        Enrollment Price (₹)
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="enrollment-price"
                          type="number"
                          value={paymentSettings.ambassadorPrice}
                          onChange={(e) =>
                            setPaymentSettings({
                              ...paymentSettings,
                              ambassadorPrice: parseInt(e.target.value),
                            })
                          }
                        />
                        <Button onClick={handleSavePaymentSettings}>
                          Save
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Program Status</Label>
                      <div className="flex items-center justify-between">
                        <span>Enable Ambassador Program</span>
                        <Switch checked={true} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Automatic Approval</Label>
                      <div className="flex items-center justify-between">
                        <span>Auto-approve new ambassadors</span>
                        <Switch checked={false} />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="kit-items">Ambassador Kit Items</Label>
                      <Textarea
                        id="kit-items"
                        placeholder="List items included in the ambassador kit"
                        defaultValue="1. Premium Tathaastu T-shirt\n2. Branded Cap\n3. Marketing Materials\n4. Digital Asset Pack"
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={handleSavePaymentSettings}
                    >
                      Save All Settings
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Content Management
                </h1>
              </div>

              <Tabs defaultValue="homepage" className="w-full">
                <TabsList>
                  <TabsTrigger value="homepage">Homepage</TabsTrigger>
                  <TabsTrigger value="about">About Us</TabsTrigger>
                  <TabsTrigger value="howItWorks">How It Works</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="brandAmbassador">
                    Brand Ambassador
                  </TabsTrigger>
                  <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                </TabsList>

                <TabsContent value="homepage" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Hero Section</CardTitle>
                      <CardDescription>
                        Edit the main hero section content
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="hero-title">Hero Title</Label>
                        <Input
                          id="hero-title"
                          value={pageContent.home.heroTitle}
                          onChange={(e) =>
                            setPageContent({
                              ...pageContent,
                              home: {
                                ...pageContent.home,
                                heroTitle: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                        <Input
                          id="hero-subtitle"
                          value={pageContent.home.heroSubtitle}
                          onChange={(e) =>
                            setPageContent({
                              ...pageContent,
                              home: {
                                ...pageContent.home,
                                heroSubtitle: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hero-image">
                          Hero Background Image URL
                        </Label>
                        <Input
                          id="hero-image"
                          value={pageContent.home.heroImage}
                          onChange={(e) =>
                            setPageContent({
                              ...pageContent,
                              home: {
                                ...pageContent.home,
                                heroImage: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Features Section</CardTitle>
                      <CardDescription>
                        Edit the features section content
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="features-title">Section Title</Label>
                          <Input
                            id="features-title"
                            value={pageContent.home.featuresTitle}
                            onChange={(e) =>
                              setPageContent({
                                ...pageContent,
                                home: {
                                  ...pageContent.home,
                                  featuresTitle: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="features-description">
                            Section Description
                          </Label>
                          <Textarea
                            id="features-description"
                            value={pageContent.home.featuresDescription}
                            onChange={(e) =>
                              setPageContent({
                                ...pageContent,
                                home: {
                                  ...pageContent.home,
                                  featuresDescription: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => handleSavePageContent("Home")}>
                        Save Changes
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="about" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>About Us Page</CardTitle>
                      <CardDescription>
                        Edit the about us page content
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="about-title">Page Title</Label>
                        <Input
                          id="about-title"
                          value={pageContent.about.title}
                          onChange={(e) =>
                            setPageContent({
                              ...pageContent,
                              about: {
                                ...pageContent.about,
                                title: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="about-content">Page Content</Label>
                        <Textarea
                          id="about-content"
                          value={pageContent.about.content}
                          onChange={(e) =>
                            setPageContent({
                              ...pageContent,
                              about: {
                                ...pageContent.about,
                                content: e.target.value,
                              },
                            })
                          }
                          className="min-h-[200px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="team-members">Team Members</Label>
                        <Textarea
                          id="team-members"
                          value={pageContent.about.teamMembers}
                          onChange={(e) =>
                            setPageContent({
                              ...pageContent,
                              about: {
                                ...pageContent.about,
                                teamMembers: e.target.value,
                              },
                            })
                          }
                          className="min-h-[100px]"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => handleSavePageContent("About")}>
                        Save Changes
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="howItWorks" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>How It Works Page</CardTitle>
                      <CardDescription>
                        Edit the how it works page content
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="how-it-works-title">Page Title</Label>
                        <Input
                          id="how-it-works-title"
                          value={pageContent.howItWorks.title}
                          onChange={(e) =>
                            setPageContent({
                              ...pageContent,
                              howItWorks: {
                                ...pageContent.howItWorks,
                                title: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="how-it-works-content">
                          Page Content
                        </Label>
                        <Textarea
                          id="how-it-works-content"
                          value={pageContent.howItWorks.content}
                          onChange={(e) =>
                            setPageContent({
                              ...pageContent,
                              howItWorks: {
                                ...pageContent.howItWorks,
                                content: e.target.value,
                              },
                            })
                          }
                          className="min-h-[200px]"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={() => handleSavePageContent("How It Works")}
                      >
                        Save Changes
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Page</CardTitle>
                      <CardDescription>
                        Edit the contact page content
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact-title">Page Title</Label>
                        <Input
                          id="contact-title"
                          value={pageContent.contact.title}
                          onChange={(e) =>
                            setPageContent({
                              ...pageContent,
                              contact: {
                                ...pageContent.contact,
                                title: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-content">Page Content</Label>
                        <Textarea
                          id="contact-content"
                          value={pageContent.contact.content}
                          onChange={(e) =>
                            setPageContent({
                              ...pageContent,
                              contact: {
                                ...pageContent.contact,
                                content: e.target.value,
                              },
                            })
                          }
                          className="min-h-[200px]"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => handleSavePageContent("Contact")}>
                        Save Changes
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="brandAmbassador" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Brand Ambassador Page</CardTitle>
                      <CardDescription>
                        Edit the brand ambassador page content
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="brand-ambassador-title">
                          Page Title
                        </Label>
                        <Input
                          id="brand-ambassador-title"
                          value={pageContent.brandAmbassador.title}
                          onChange={(e) =>
                            setPageContent({
                              ...pageContent,
                              brandAmbassador: {
                                ...pageContent.brandAmbassador,
                                title: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="brand-ambassador-description">
                          Page Description
                        </Label>
                        <Textarea
                          id="brand-ambassador-description"
                          value={pageContent.brandAmbassador.description}
                          onChange={(e) =>
                            setPageContent({
                              ...pageContent,
                              brandAmbassador: {
                                ...pageContent.brandAmbassador,
                                description: e.target.value,
                              },
                            })
                          }
                          className="min-h-[200px]"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={() =>
                          handleSavePageContent("Brand Ambassador")
                        }
                      >
                        Save Changes
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="testimonials" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Testimonials Section</CardTitle>
                      <CardDescription>
                        Edit the testimonials section content
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="testimonials-title">
                          Section Title
                        </Label>
                        <Input
                          id="testimonials-title"
                          value={pageContent.testimonials.title}
                          onChange={(e) =>
                            setPageContent({
                              ...pageContent,
                              testimonials: {
                                ...pageContent.testimonials,
                                title: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="testimonials-description">
                          Section Description
                        </Label>
                        <Input
                          id="testimonials-description"
                          value={pageContent.testimonials.description}
                          onChange={(e) =>
                            setPageContent({
                              ...pageContent,
                              testimonials: {
                                ...pageContent.testimonials,
                                description: e.target.value,
                              },
                            })
                          }
                        />
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">
                            Testimonial Items
                          </h3>
                          <Button
                            size="sm"
                            onClick={() => {
                              const newItem = {
                                id: Date.now().toString(),
                                name: "New Testimonial",
                                role: "Customer",
                                content: "This platform is amazing!",
                                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
                                rating: 5,
                              };

                              setPageContent({
                                ...pageContent,
                                testimonials: {
                                  ...pageContent.testimonials,
                                  items: [
                                    ...pageContent.testimonials.items,
                                    newItem,
                                  ],
                                },
                              });
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Testimonial
                          </Button>
                        </div>

                        {pageContent.testimonials.items.map((item, index) => (
                          <Card key={item.id} className="relative">
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6"
                              onClick={() => {
                                const updatedItems =
                                  pageContent.testimonials.items.filter(
                                    (_, i) => i !== index,
                                  );
                                setPageContent({
                                  ...pageContent,
                                  testimonials: {
                                    ...pageContent.testimonials,
                                    items: updatedItems,
                                  },
                                });
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                            <CardContent className="pt-6">
                              <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-4">
                                <div className="flex flex-col items-center gap-2">
                                  <div className="w-20 h-20 rounded-full overflow-hidden border">
                                    <img
                                      src={item.avatar}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <button
                                        key={i}
                                        type="button"
                                        className={`text-${i < item.rating ? "yellow-500" : "gray-300"}`}
                                        onClick={() => {
                                          const updatedItems = [
                                            ...pageContent.testimonials.items,
                                          ];
                                          updatedItems[index] = {
                                            ...updatedItems[index],
                                            rating: i + 1,
                                          };
                                          setPageContent({
                                            ...pageContent,
                                            testimonials: {
                                              ...pageContent.testimonials,
                                              items: updatedItems,
                                            },
                                          });
                                        }}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                          className="w-4 h-4"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div className="space-y-2">
                                    <Label htmlFor={`name-${item.id}`}>
                                      Name
                                    </Label>
                                    <Input
                                      id={`name-${item.id}`}
                                      value={item.name}
                                      onChange={(e) => {
                                        const updatedItems = [
                                          ...pageContent.testimonials.items,
                                        ];
                                        updatedItems[index] = {
                                          ...updatedItems[index],
                                          name: e.target.value,
                                        };
                                        setPageContent({
                                          ...pageContent,
                                          testimonials: {
                                            ...pageContent.testimonials,
                                            items: updatedItems,
                                          },
                                        });
                                      }}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`role-${item.id}`}>
                                      Role/Title
                                    </Label>
                                    <Input
                                      id={`role-${item.id}`}
                                      value={item.role}
                                      onChange={(e) => {
                                        const updatedItems = [
                                          ...pageContent.testimonials.items,
                                        ];
                                        updatedItems[index] = {
                                          ...updatedItems[index],
                                          role: e.target.value,
                                        };
                                        setPageContent({
                                          ...pageContent,
                                          testimonials: {
                                            ...pageContent.testimonials,
                                            items: updatedItems,
                                          },
                                        });
                                      }}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`content-${item.id}`}>
                                      Testimonial
                                    </Label>
                                    <Textarea
                                      id={`content-${item.id}`}
                                      value={item.content}
                                      onChange={(e) => {
                                        const updatedItems = [
                                          ...pageContent.testimonials.items,
                                        ];
                                        updatedItems[index] = {
                                          ...updatedItems[index],
                                          content: e.target.value,
                                        };
                                        setPageContent({
                                          ...pageContent,
                                          testimonials: {
                                            ...pageContent.testimonials,
                                            items: updatedItems,
                                          },
                                        });
                                      }}
                                      className="min-h-[100px]"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`avatar-${item.id}`}>
                                      Avatar URL
                                    </Label>
                                    <Input
                                      id={`avatar-${item.id}`}
                                      value={item.avatar}
                                      onChange={(e) => {
                                        const updatedItems = [
                                          ...pageContent.testimonials.items,
                                        ];
                                        updatedItems[index] = {
                                          ...updatedItems[index],
                                          avatar: e.target.value,
                                        };
                                        setPageContent({
                                          ...pageContent,
                                          testimonials: {
                                            ...pageContent.testimonials,
                                            items: updatedItems,
                                          },
                                        });
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={() => {
                          handleSavePageContent("Testimonials");
                          // Also save to localStorage for persistence
                          const existingSettings =
                            localStorage.getItem("siteSettings");
                          const settings = existingSettings
                            ? JSON.parse(existingSettings)
                            : {};
                          settings.testimonials = pageContent.testimonials;
                          localStorage.setItem(
                            "siteSettings",
                            JSON.stringify(settings),
                          );

                          // Dispatch storage event to notify other components
                          window.dispatchEvent(
                            new StorageEvent("storage", {
                              key: "siteSettings",
                              newValue: JSON.stringify(settings),
                            }),
                          );
                        }}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Testimonials
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Appearance Settings
                </h1>
                <Button onClick={handleSaveSiteSettings}>Save Changes</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Branding</CardTitle>
                    <CardDescription>
                      Configure your website branding elements
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="site-name">Site Name</Label>
                      <Input
                        id="site-name"
                        value={siteSettings.siteName}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            siteName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="site-tagline">Site Tagline</Label>
                      <Input
                        id="site-tagline"
                        value={siteSettings.siteTagline}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            siteTagline: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="site-description">Site Description</Label>
                      <Textarea
                        id="site-description"
                        value={siteSettings.siteDescription}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            siteDescription: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="logo-url">Logo URL</Label>
                      <Input
                        id="logo-url"
                        value={siteSettings.logoUrl}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            logoUrl: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="favicon-url">Favicon URL</Label>
                      <Input
                        id="favicon-url"
                        value={siteSettings.faviconUrl}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            faviconUrl: e.target.value,
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Colors & Theme</CardTitle>
                    <CardDescription>
                      Customize the colors and theme of your website
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primary-color"
                          value={siteSettings.primaryColor}
                          onChange={(e) =>
                            setSiteSettings({
                              ...siteSettings,
                              primaryColor: e.target.value,
                            })
                          }
                        />
                        <div
                          className="h-10 w-10 rounded-md border"
                          style={{ backgroundColor: siteSettings.primaryColor }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondary-color">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondary-color"
                          value={siteSettings.secondaryColor}
                          onChange={(e) =>
                            setSiteSettings({
                              ...siteSettings,
                              secondaryColor: e.target.value,
                            })
                          }
                        />
                        <div
                          className="h-10 w-10 rounded-md border"
                          style={{
                            backgroundColor: siteSettings.secondaryColor,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Theme Preview</Label>
                      <div className="p-4 border rounded-md">
                        <div className="space-y-4">
                          <div
                            className="h-12 rounded-md flex items-center justify-center text-white font-medium"
                            style={{
                              backgroundColor: siteSettings.primaryColor,
                            }}
                          >
                            Primary Button
                          </div>
                          <div
                            className="h-12 rounded-md flex items-center justify-center text-white font-medium"
                            style={{
                              backgroundColor: siteSettings.secondaryColor,
                            }}
                          >
                            Secondary Button
                          </div>
                          <div className="flex gap-2">
                            <div
                              className="h-8 w-8 rounded-full"
                              style={{
                                backgroundColor: siteSettings.primaryColor,
                              }}
                            ></div>
                            <div
                              className="h-8 w-8 rounded-full"
                              style={{
                                backgroundColor: siteSettings.secondaryColor,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Footer Settings</CardTitle>
                    <CardDescription>
                      Configure the footer content of your website
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="footer-text">Footer Text</Label>
                      <Input
                        id="footer-text"
                        value={siteSettings.footerText}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            footerText: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="facebook-url">Facebook URL</Label>
                        <Input
                          id="facebook-url"
                          value={siteSettings.socialLinks.facebook}
                          onChange={(e) =>
                            setSiteSettings({
                              ...siteSettings,
                              socialLinks: {
                                ...siteSettings.socialLinks,
                                facebook: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instagram-url">Instagram URL</Label>
                        <Input
                          id="instagram-url"
                          value={siteSettings.socialLinks.instagram}
                          onChange={(e) =>
                            setSiteSettings({
                              ...siteSettings,
                              socialLinks: {
                                ...siteSettings.socialLinks,
                                instagram: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter-url">Twitter URL</Label>
                        <Input
                          id="twitter-url"
                          value={siteSettings.socialLinks.twitter}
                          onChange={(e) =>
                            setSiteSettings({
                              ...siteSettings,
                              socialLinks: {
                                ...siteSettings.socialLinks,
                                twitter: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin-url">LinkedIn URL</Label>
                        <Input
                          id="linkedin-url"
                          value={siteSettings.socialLinks.linkedin}
                          onChange={(e) =>
                            setSiteSettings({
                              ...siteSettings,
                              socialLinks: {
                                ...siteSettings.socialLinks,
                                linkedin: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Media Library
                </h1>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Media
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Media Files</CardTitle>
                  <CardDescription>
                    Manage images and other media files used on the website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Mock media items */}
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div
                        key={index}
                        className="relative group overflow-hidden rounded-md border bg-muted/40"
                      >
                        <img
                          src={`https://images.unsplash.com/photo-${1550000000 + index * 10000}?w=300&h=300&q=80`}
                          alt={`Media item ${index + 1}`}
                          className="aspect-square object-cover w-full transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <div className="text-sm text-muted-foreground">
                    Showing 8 of 24 media files
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Payment Settings
                </h1>
                <Button onClick={handleSavePaymentSettings}>
                  Save Changes
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Razorpay Integration</CardTitle>
                    <CardDescription>
                      Configure Razorpay payment gateway settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="razorpay-key">API Key ID</Label>
                      <Input
                        id="razorpay-key"
                        value={paymentSettings.razorpayKeyId}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            razorpayKeyId: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="razorpay-secret">API Key Secret</Label>
                      <Input
                        id="razorpay-secret"
                        type="password"
                        value={paymentSettings.razorpayKeySecret}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            razorpayKeySecret: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <select
                        id="currency"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={paymentSettings.currency}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            currency: e.target.value,
                          })
                        }
                      >
                        <option value="INR">Indian Rupee (INR)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                        <option value="GBP">British Pound (GBP)</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enable-payments"
                        checked={paymentSettings.enablePayments}
                        onCheckedChange={(checked) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            enablePayments: checked,
                          })
                        }
                      />
                      <Label htmlFor="enable-payments">Enable payments</Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Notifications</CardTitle>
                    <CardDescription>
                      Configure email notifications for payments
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">
                        Admin Notification Email
                      </Label>
                      <Input
                        id="admin-email"
                        type="email"
                        value={siteSettings.contactEmail}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            contactEmail: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="notify-success" defaultChecked />
                        <Label htmlFor="notify-success">
                          Notify on successful payments
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="notify-failed" defaultChecked />
                        <Label htmlFor="notify-failed">
                          Notify on failed payments
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="customer-receipt" defaultChecked />
                        <Label htmlFor="customer-receipt">
                          Send receipt to customer
                        </Label>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="receipt-template">
                        Email Receipt Template
                      </Label>
                      <Textarea
                        id="receipt-template"
                        defaultValue="Dear {{name}},\n\nThank you for your payment of {{amount}} for {{item}}.\n\nYour transaction ID is: {{transaction_id}}\n\nRegards,\nTathaastu Team"
                        className="min-h-[120px] font-mono text-sm"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">
                  SEO Settings
                </h1>
                <Button onClick={handleSaveSiteSettings}>Save Changes</Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Global SEO Settings</CardTitle>
                  <CardDescription>
                    Configure global SEO settings for your website
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta-title">Meta Title</Label>
                    <Input
                      id="meta-title"
                      value={siteSettings.metaTitle}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          metaTitle: e.target.value,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      The title that appears in search engine results
                      (recommended: 50-60 characters)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta-description">Meta Description</Label>
                    <Textarea
                      id="meta-description"
                      value={siteSettings.metaDescription}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          metaDescription: e.target.value,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      The description that appears in search engine results
                      (recommended: 150-160 characters)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta-keywords">Meta Keywords</Label>
                    <Input
                      id="meta-keywords"
                      value={siteSettings.metaKeywords}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          metaKeywords: e.target.value,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Keywords related to your website (comma-separated)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Social Media Preview</CardTitle>
                  <CardDescription>
                    Configure how your website appears when shared on social
                    media
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="og-title">Open Graph Title</Label>
                    <Input
                      id="og-title"
                      defaultValue={siteSettings.metaTitle}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="og-description">
                      Open Graph Description
                    </Label>
                    <Textarea
                      id="og-description"
                      defaultValue={siteSettings.metaDescription}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="og-image">Open Graph Image URL</Label>
                    <Input id="og-image" defaultValue={siteSettings.logoUrl} />
                    <p className="text-xs text-muted-foreground">
                      The image that appears when your website is shared on
                      social media (recommended size: 1200x630 pixels)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">
                  System Settings
                </h1>
                <Button onClick={handleSaveSiteSettings}>Save Changes</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>
                      Configure contact information for your website
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Contact Email</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={siteSettings.contactEmail}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            contactEmail: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone">Contact Phone</Label>
                      <Input
                        id="contact-phone"
                        value={siteSettings.contactPhone}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            contactPhone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-address">Office Address</Label>
                      <Textarea
                        id="contact-address"
                        value={siteSettings.contactAddress}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            contactAddress: e.target.value,
                          })
                        }
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Configure security settings for your website
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">
                        Session Timeout (minutes)
                      </Label>
                      <Input
                        id="session-timeout"
                        type="number"
                        defaultValue="60"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="force-ssl" defaultChecked />
                      <Label htmlFor="force-ssl">Force SSL</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="two-factor" />
                      <Label htmlFor="two-factor">Require 2FA for admins</Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-policy">Password Policy</Label>
                      <select
                        id="password-policy"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue="strong"
                      >
                        <option value="basic">Basic (min 8 characters)</option>
                        <option value="medium">
                          Medium (min 8 chars, 1 number)
                        </option>
                        <option value="strong">
                          Strong (min 8 chars, 1 number, 1 special char)
                        </option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
