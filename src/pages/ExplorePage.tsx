import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

// Mock data for sample registries
const registries = [
  {
    id: "wedding-sample",
    title: "Sarah & Michael's Wedding",
    date: "June 15, 2024",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
    items: 42,
    purchased: 18,
    type: "Wedding",
  },
  {
    id: "baby-sample",
    title: "Emma's Baby Shower",
    date: "August 3, 2024",
    image:
      "https://images.unsplash.com/photo-1515923152115-758a6b16f35e?w=800&q=80",
    items: 36,
    purchased: 12,
    type: "Baby Shower",
  },
  {
    id: "birthday-sample",
    title: "John's 30th Birthday",
    date: "July 22, 2024",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
    items: 24,
    purchased: 5,
    type: "Birthday",
  },
  {
    id: "wedding-sample-2",
    title: "Alex & Jamie's Wedding",
    date: "September 8, 2024",
    image:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80",
    items: 38,
    purchased: 22,
    type: "Wedding",
  },
  {
    id: "graduation-sample",
    title: "David's Graduation",
    date: "May 20, 2024",
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800&q=80",
    items: 18,
    purchased: 7,
    type: "Graduation",
  },
  {
    id: "housewarming-sample",
    title: "The Johnsons' Housewarming",
    date: "April 12, 2024",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
    items: 30,
    purchased: 15,
    type: "Housewarming",
  },
];

const occasionTypes = [
  "All",
  "Wedding",
  "Baby Shower",
  "Birthday",
  "Anniversary",
  "Graduation",
  "Housewarming",
  "Holiday",
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [occasionFilter, setOccasionFilter] = useState("All");

  const filteredRegistries = registries.filter((registry) => {
    const matchesSearch = registry.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesOccasion =
      occasionFilter === "All" || registry.type === occasionFilter;
    return matchesSearch && matchesOccasion;
  });

  return (
    <div className="bg-background">
      <div className="relative h-64 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
        <div className="container text-center px-6">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Explore Registries
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Browse through public registries to get inspired or find a specific
            registry.
          </p>
        </div>
      </div>

      <div className="container mx-auto py-12 px-6">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search registries..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={occasionFilter} onValueChange={setOccasionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by occasion" />
              </SelectTrigger>
              <SelectContent>
                {occasionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button asChild>
            <Link to="/create-registry">Create Registry</Link>
          </Button>
        </div>

        {filteredRegistries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRegistries.map((registry) => (
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
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No registries found</h2>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters.
            </p>
            <Button asChild>
              <Link to="/create-registry">Create Your Own Registry</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
