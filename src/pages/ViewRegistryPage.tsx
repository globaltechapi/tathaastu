import { useState } from "react";
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

// Mock data for the registry
const registryData = {
  id: "wedding-sample",
  title: "Sarah & Michael's Wedding",
  date: "June 15, 2024",
  description:
    "Thank you for helping us celebrate our special day! We've created this registry to make gift-giving easier for our friends and family.",
  type: "Wedding",
  items: [
    {
      id: "item1",
      name: "KitchenAid Stand Mixer",
      price: 349.99,
      image:
        "https://images.unsplash.com/photo-1578598336057-368469d7c721?w=400&q=80",
      priority: "High",
      purchased: false,
      note: "We'd love this in red to match our kitchen decor!",
    },
    {
      id: "item2",
      name: "Dyson V11 Vacuum",
      price: 599.99,
      image:
        "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&q=80",
      priority: "Medium",
      purchased: true,
      note: "This would be perfect for our new home.",
    },
    {
      id: "item3",
      name: "Nespresso Coffee Maker",
      price: 149.99,
      image:
        "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&q=80",
      priority: "Low",
      purchased: false,
      note: "We both love coffee in the morning!",
    },
    {
      id: "item4",
      name: "Cuisinart 14-Cup Food Processor",
      price: 199.95,
      image:
        "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80",
      priority: "Medium",
      purchased: false,
      note: "Would be great for meal prep!",
    },
    {
      id: "item5",
      name: "Ninja Foodi 9-in-1 Pressure Cooker",
      price: 159.99,
      image:
        "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400&q=80",
      priority: "Low",
      purchased: false,
      note: "We've heard great things about this!",
    },
    {
      id: "item6",
      name: "Breville Smart Oven Air Fryer Pro",
      price: 349.95,
      image:
        "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80",
      priority: "High",
      purchased: false,
      note: "Perfect for our small kitchen!",
    },
  ],
};

export default function ViewRegistryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<
    (typeof registryData.items)[0] | null
  >(null);
  const [purchaserName, setPurchaserName] = useState("");
  const [purchaserEmail, setPurchaserEmail] = useState("");
  const [purchaserMessage, setPurchaserMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredItems = registryData.items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleReserveItem = (item: (typeof registryData.items)[0]) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleConfirmReservation = () => {
    // In a real app, we would save the reservation to the database
    setDialogOpen(false);
    // Show confirmation message or toast
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

  return (
    <div className="bg-background">
      <div className="relative h-64 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
        <div className="container text-center px-6">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            {registryData.title}
          </h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline">{registryData.type}</Badge>
            <p className="text-sm text-muted-foreground">{registryData.date}</p>
          </div>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            {registryData.description}
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
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className={item.purchased ? "opacity-75" : ""}>
              <div className="relative h-48 w-full">
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
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
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover rounded-md"
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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmReservation}>
              Confirm Reservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
