import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <section className="py-20 px-6 bg-primary text-primary-foreground">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-semibold tracking-tight mb-4">
          Tathaastu: Make a Meaningful Impact Today
        </h2>
        <p className="text-xl max-w-2xl mx-auto mb-4 opacity-90">
          Whether you're an individual, orphanage, elderly home, or NGO, our
          platform connects needs with generous hearts.
        </p>
        <p className="text-lg max-w-2xl mx-auto mb-8 opacity-90">
          Create a registry that truly matters and share it with your community
          of supporters.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" variant="secondary" asChild>
            <Link to="/create-registry">Create Registry</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent border-primary-foreground hover:bg-primary-foreground/10"
            asChild
          >
            <Link to="/how-it-works">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
