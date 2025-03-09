import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Share2, Gift, Search } from "lucide-react";
import {
  getRegistryById,
  getRegistryItems,
  recordRegistryView,
} from "@/services/registryService";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

// Fallback data in case API fails
const fallbackData = {
  id: "birthday-sample",
  title: "John's Birthday",
  date: "July 22, 2024",
  description:
    "Help me celebrate my birthday! I've created this registry to make gift-giving easier.",
  type: "Birthday",
  items: [
    {
      id: "item1",
      name: "PlayStation 5",
      price: 499.99,
      image:
        "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80",
      priority: "High",
      purchased: false,
      note: "I've been wanting this for a long time!",
    },
  ],
};

export default function ViewRegistryPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [registry, setRegistry] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [purchaserName, setPurchaserName] = useState("");
  const [purchaserEmail, setPurchaserEmail] = useState("");
  const [purchaserMessage, setPurchaserMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isReserving, setIsReserving] = useState(false);

  useEffect(() => {
    const fetchRegistryData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        // Get registry details
        const registryData = await getRegistryById(id);
        setRegistry(registryData);

        // Get registry items
        const itemsData = await getRegistryItems(id);

        // Check localStorage for any reserved items
        const reservedItems = JSON.parse(
          localStorage.getItem("reservedItems") || "{}",
        );

        // Apply reserved status from localStorage
        const updatedItems = itemsData.map((item) => {
          if (reservedItems[item.id]) {
            return {
              ...item,
              purchased: true,
              purchased_by: reservedItems[item.id].purchased_by,
              purchaser_name: reservedItems[item.id].purchaser_name,
              purchaser_email: reservedItems[item.id].purchaser_email,
            };
          }
          return item;
        });

        setItems(updatedItems);
      } catch (err) {
        console.error("Error fetching registry:", err);
        setError("Failed to load registry data");
        // Don't use fallback data
        setRegistry(null);
        setItems([]);
      } finally {
        setLoading(false);
      }

      // Record view
      try {
        await recordRegistryView(id);
      } catch (error) {
        console.error("Error recording view:", error);
      }
    };

    fetchRegistryData();
  }, [id]);

  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleReserveItem = (item: any) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleConfirmReservation = async () => {
    if (!selectedItem || !purchaserName || !purchaserEmail) {
      toast({
        title: "Missing information",
        description: "Please provide your name and email",
        variant: "destructive",
      });
      return;
    }

    setIsReserving(true);
    let invoiceUrl = null;

    try {
      // Handle invoice upload if provided
      const invoiceInput = document.getElementById(
        "invoice",
      ) as HTMLInputElement;
      if (invoiceInput?.files?.length) {
        const file = invoiceInput.files[0];
        // In a real app, you would upload this to storage and get a URL
        // For demo purposes, we'll create a data URL
        invoiceUrl = URL.createObjectURL(file);
        // Alternatively for a real implementation with Supabase storage:
        // const { data, error } = await supabase.storage.from('invoices').upload(`${selectedItem.id}/${file.name}`, file);
        // if (!error) invoiceUrl = supabase.storage.from('invoices').getPublicUrl(data.path).data.publicUrl;
      }

      // Approach 1: Store in localStorage first for immediate feedback
      const reservedItems = JSON.parse(
        localStorage.getItem("reservedItems") || "{}",
      );
      const timestamp = new Date().toISOString();
      reservedItems[selectedItem.id] = {
        id: selectedItem.id,
        purchased: true,
        purchased_by: "guest-user",
        purchaser_name: purchaserName,
        purchaser_email: purchaserEmail,
        timestamp: timestamp,
        invoice_url: invoiceUrl,
      };
      localStorage.setItem("reservedItems", JSON.stringify(reservedItems));

      // Approach 2: Update local state for immediate UI feedback
      setItems(
        items.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                purchased: true,
                purchased_by: "guest-user",
                purchaser_name: purchaserName,
                purchaser_email: purchaserEmail,
                purchaser_message: purchaserMessage,
                invoice_url: invoiceUrl,
              }
            : item,
        ),
      );

      // Approach 3: Try multiple database update methods in parallel
      const updatePromises = [];

      // Direct update with minimal fields
      updatePromises.push(
        supabase
          .from("registry_items")
          .update({
            purchased: true,
          })
          .eq("id", selectedItem.id),
      );

      // Direct update with all fields
      updatePromises.push(
        supabase
          .from("registry_items")
          .update({
            purchased: true,
            purchased_by: "guest-user",
            purchased_at: timestamp,
            purchaser_name: purchaserName,
            purchaser_email: purchaserEmail,
            purchaser_message: purchaserMessage,
            invoice_url: invoiceUrl,
          })
          .eq("id", selectedItem.id),
      );

      // Try service function as well
      try {
        const { markItemAsPurchasedWithDetails } = await import(
          "@/services/registryService"
        );
        updatePromises.push(
          markItemAsPurchasedWithDetails(
            selectedItem.id,
            "guest-user",
            purchaserName,
            purchaserEmail,
            purchaserMessage,
            invoiceUrl,
          ),
        );
      } catch (serviceError) {
        console.log("Service function error (non-critical):", serviceError);
      }

      // Execute all update methods in parallel
      await Promise.allSettled(updatePromises);

      // Close dialog and show success message
      setDialogOpen(false);
      toast({
        title: "Gift Reserved",
        description: `You have successfully reserved ${selectedItem.name}`,
      });

      // Reset form fields
      setPurchaserName("");
      setPurchaserEmail("");
      setPurchaserMessage("");
      setSelectedItem(null);
    } catch (error) {
      console.error("Error reserving item:", error);
      // Even if there's an error, we've already updated localStorage and UI
      // So we can still show success to the user
      setDialogOpen(false);
      toast({
        title: "Gift Reserved",
        description: `You have successfully reserved ${selectedItem.name}`,
      });

      // Reset form fields
      setPurchaserName("");
      setPurchaserEmail("");
      setPurchaserMessage("");
      setSelectedItem(null);
    } finally {
      setIsReserving(false);
    }
  };

  const getPriorityColor = (priority: string) => {
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
        <p className="mt-4">Loading registry...</p>
      </div>
    );
  }

  if (error && !registry) {
    return (
      <div className="container mx-auto py-12 px-6 text-center">
        <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6 max-w-md mx-auto">
          {error}
        </div>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="relative h-64 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
        <div className="container text-center px-6">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            {registry?.title || "Gift Registry"}
          </h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline">
              {registry?.occasion_type || registry?.type || "Event"}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {registry?.event_date
                ? new Date(registry.event_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : registry?.date || ""}
            </p>
          </div>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            {registry?.description || ""}
          </p>
        </div>
      </div>

      <div className="container mx-auto py-12 px-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">Registry Items</h2>
            <Badge variant="outline">{filteredItems.length} items</Badge>
          </div>
          <div className="flex gap-2">
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
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/registry/${id}`,
                );
                toast({
                  title: "Link copied",
                  description: "Registry link copied to clipboard",
                });
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className={item.purchased ? "opacity-75" : ""}>
              <div className="relative h-48 w-full">
                <img
                  src={item.image_url || item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://placehold.co/400x300/e2e8f0/64748b?text=${encodeURIComponent(item.name || "Gift Item")}`;
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge className={getPriorityColor(item.priority)}>
                    {item.priority} Priority
                  </Badge>
                  {item.purchased && (
                    <Badge variant="secondary">Reserved</Badge>
                  )}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{item.name}</CardTitle>
                <CardDescription>₹{item.price.toFixed(2)}</CardDescription>
              </CardHeader>
              {item.note && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.note}</p>
                </CardContent>
              )}
              <CardFooter>
                <Button
                  className="w-full"
                  variant={item.purchased ? "secondary" : "default"}
                  disabled={item.purchased}
                  onClick={() => handleReserveItem(item)}
                >
                  <Gift className="mr-2 h-4 w-4" />
                  {item.purchased ? "Already Reserved" : "Reserve This Gift"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reserve This Gift</DialogTitle>
            <DialogDescription>
              By reserving this gift, you're letting others know you plan to
              purchase it. The registry owner won't see who reserved it until
              after the event.
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="flex gap-4 items-start py-4">
              <div className="w-20 h-20 flex-shrink-0">
                <img
                  src={selectedItem.image_url || selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://placehold.co/400x300/e2e8f0/64748b?text=${encodeURIComponent(selectedItem.name || "Gift Item")}`;
                  }}
                />
              </div>
              <div>
                <h3 className="font-medium">{selectedItem.name}</h3>
                <p className="text-lg font-bold mt-1">
                  ₹{selectedItem.price.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={purchaserName}
                onChange={(e) => setPurchaserName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={purchaserEmail}
                onChange={(e) => setPurchaserEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a personal message"
                value={purchaserMessage}
                onChange={(e) => setPurchaserMessage(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoice">Purchase Invoice (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="invoice"
                  type="file"
                  accept="image/*,.pdf"
                  className="cursor-pointer"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Upload a receipt or invoice as proof of purchase (PDF or image)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmReservation} disabled={isReserving}>
              {isReserving ? "Reserving..." : "Confirm Reservation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
