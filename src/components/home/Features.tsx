import {
  ShoppingCart,
  Share2,
  Gift,
  Calendar,
  Shield,
  Bell,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const features = [
  {
    icon: <ShoppingCart className="h-10 w-10 text-primary" />,
    title: "Amazon Integration",
    description:
      "Easily add items from Amazon to your registry with our seamless integration, perfect for organizations with specific needs.",
    is3D: false,
  },
  {
    icon: <Share2 className="h-10 w-10 text-primary" />,
    title: "Community Sharing",
    description:
      "Share your registry with donors, supporters, and community members via custom URLs, email, or social media.",
    is3D: false,
  },
  {
    icon: <Gift className="h-10 w-10 text-primary" />,
    title: "Transparent Giving",
    description:
      "Donors can see exactly what items are needed and track when their contributions make a difference.",
    is3D: false,
  },
  {
    icon: <Calendar className="h-10 w-10 text-primary" />,
    title: "For Every Purpose",
    description:
      "Create registries for personal celebrations, orphanages, elderly homes, NGOs, and community projects.",
    is3D: false,
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "Organization Verification",
    description:
      "Verified badges for legitimate organizations help donors give with confidence and trust.",
    is3D: false,
  },
  {
    icon: <Bell className="h-10 w-10 text-primary" />,
    title: "Real-time Notifications",
    description:
      "Get instant updates when someone contributes to your registry or when items are purchased from your wishlist.",
    is3D: true,
  },
];

function WaitlistDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setOpen(false);

      // Show success toast
      toast({
        title: "You're on the waitlist!",
        description: "We'll notify you when our mobile app launches.",
      });

      // Reset form
      setName("");
      setEmail("");
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="mt-6 bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 relative overflow-hidden group">
          <span className="relative z-10">Join Waitlist</span>
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Join the Mobile App Waitlist
          </DialogTitle>
          <DialogDescription>
            Be the first to know when our mobile app launches. We'll send you an
            invitation to download it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Your Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="border-primary/20 focus:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="border-primary/20 focus:border-primary/50"
            />
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Join Waitlist"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Features() {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background 3D elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-30"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="container mx-auto relative z-10 transform perspective-1000">
        <div className="text-center mb-16 relative">
          {/* 3D decorative elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-full blur-3xl opacity-30 scale-75"></div>

          {/* 3D text with shadow and gradient */}
          <div className="relative z-10 transform hover:scale-105 transition-all duration-500">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 drop-shadow-sm">
              Tathaastu: Everything You Need for Your Registry
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-purple-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto relative">
              Our platform makes it easy to create and manage your gift registry
              with powerful features.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transform hover:rotate-y-1 transition-transform duration-700">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-card p-6 rounded-lg border transform hover:scale-105 transition-all duration-300 shadow-lg relative overflow-hidden preserve-3d`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 z-0"></div>
              <div className="relative z-10 flex justify-center">
                <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 p-5 rounded-full transform hover:rotate-12 transition-transform mb-6">
                  {feature.icon}
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-semibold mb-2 text-center">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-center">
                  {feature.description}
                </p>
              </div>
              <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-xl"></div>
              <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-lg"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-full blur-3xl opacity-30 scale-75"></div>
            </div>
          ))}
        </div>

        {/* Mobile App Feature with 3D Elements */}
        <div className="mt-16 bg-gradient-to-br from-primary/10 to-purple-500/10 p-8 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
            <div className="transform hover:scale-105 transition-all duration-500 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-3xl blur-xl transform -rotate-6 scale-105"></div>
                <div className="bg-background p-6 rounded-3xl shadow-lg border border-primary/20 relative transform hover:rotate-2 transition-transform duration-300">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-br from-primary to-purple-500 p-5 rounded-full">
                      <Smartphone className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&q=80"
                      alt="Mobile App"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-between mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20"></div>
                    <div className="w-16 h-4 rounded-full bg-primary/20"></div>
                    <div className="w-8 h-8 rounded-full bg-primary/20"></div>
                  </div>
                  <div className="w-full h-3 rounded-full bg-primary/20 mb-2"></div>
                  <div className="w-3/4 h-3 rounded-full bg-primary/20"></div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-2xl font-bold">Mobile App Access</h3>
                <span className="bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  COMING SOON
                </span>
              </div>
              <p className="text-lg mb-6">
                Manage your registry on the go with our intuitive mobile
                application. Receive real-time notifications, track
                contributions, and update your wishlist from anywhere.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <span>Real-time push notifications</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <span>Barcode scanner for easy item addition</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <span>Share registry with a single tap</span>
                </li>
              </ul>
              <WaitlistDialog />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
