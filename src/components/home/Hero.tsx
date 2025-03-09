import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Tathaastu: Gifts That Make a Difference
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Create and share wishlists for personal celebrations, or support
            orphanages, elderly homes, and NGOs with items they truly need.
          </p>
          <p className="text-lg text-muted-foreground mb-8">
            Every gift has the power to change a life. Connect donors with those
            who need it most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link to="/create-registry">Create Registry</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/explore">Support a Cause</Link>
            </Button>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80"
            alt="Children receiving gifts"
            className="rounded-lg shadow-xl w-full object-cover h-[400px]"
          />
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm font-medium">Just Donated</p>
            </div>
            <p className="text-sm">
              Maria just donated school supplies to Sunshine Orphanage's
              wishlist!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
