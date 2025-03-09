import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const sampleRegistries = [
  {
    id: "orphanage-sample",
    title: "Sunshine Orphanage",
    date: "Ongoing Needs",
    image:
      "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&q=80",
    items: 42,
    purchased: 18,
    type: "Orphanage",
  },
  {
    id: "elderly-sample",
    title: "Golden Years Home",
    date: "Seasonal Needs",
    image:
      "https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800&q=80",
    items: 36,
    purchased: 12,
    type: "Elderly Home",
  },
  {
    id: "ngo-sample",
    title: "Hope Foundation",
    date: "Project Supplies",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
    items: 24,
    purchased: 5,
    type: "NGO",
  },
];

export default function SampleRegistries() {
  return (
    <section className="py-20 px-6 bg-muted/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">
            Tathaastu: Make a Real Difference Today
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore these organizations and discover how your contributions can
            change lives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleRegistries.map((registry) => (
            <Card key={registry.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <img
                  src={registry.image}
                  alt={registry.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary">{registry.type}</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle>{registry.title}</CardTitle>
                <CardDescription>{registry.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{registry.items} items</span>
                  <span>{registry.purchased} purchased</span>
                </div>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${(registry.purchased / registry.items) * 100}%`,
                    }}
                  ></div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/registry/${registry.id}`}>View Registry</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
