import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Gift, Search, Share2, ShoppingCart, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: <Gift className="h-12 w-12 text-primary" />,
    title: "Create Your Registry",
    description:
      "Start by creating a personalized registry for your special occasion. Add details like your event date, description, and privacy settings.",
  },
  {
    icon: <ShoppingCart className="h-12 w-12 text-primary" />,
    title: "Add Items from Amazon",
    description:
      "Search for products on Amazon and add them to your registry with just a few clicks. Set priority levels and add personal notes for each item.",
  },
  {
    icon: <Share2 className="h-12 w-12 text-primary" />,
    title: "Share with Friends & Family",
    description:
      "Share your registry with loved ones via a custom URL, email, or social media. They'll be able to see all the items you've added.",
  },
  {
    icon: <CheckCircle className="h-12 w-12 text-primary" />,
    title: "Guests Reserve Gifts",
    description:
      "When someone decides to purchase an item, they can mark it as reserved. This prevents duplicate gifts while keeping the surprise for you.",
  },
  {
    icon: <Search className="h-12 w-12 text-primary" />,
    title: "Track Your Registry",
    description:
      "Monitor your registry's progress with real-time updates on which items have been purchased and how many people have viewed your registry.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-background">
      <div className="relative h-64 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
        <div className="container text-center px-6">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            How It Works
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Creating and sharing your gift registry is simple with our
            easy-to-use platform.
          </p>
        </div>
      </div>

      <div className="container mx-auto py-16 px-6">
        <div className="max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-6 mb-12">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                {step.icon}
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2">{step.title}</h2>
                <p className="text-muted-foreground">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="ml-8 h-12 w-0.5 bg-border mt-4"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Create your registry today and make gift-giving easier for your
            friends and family.
          </p>
          <Button size="lg" asChild>
            <Link to="/create-registry">Create Your Registry</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
