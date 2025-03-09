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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// Product type definition
type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
};

export default function AddItemPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [priority, setPriority] = useState("Medium");
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Show loading state
    setIsLoading(true);
    setSearchResults([]);

    try {
      // Call our Amazon search API endpoint
      const response = await fetch("/api/amazon-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products from Amazon");
      }

      const data = await response.json();
      setSearchResults(data.products);
    } catch (error) {
      console.error("Error searching Amazon products:", error);
      toast({
        title: "Search Error",
        description:
          "Failed to fetch products from Amazon. Using sample data instead.",
        variant: "destructive",
      });

      // Fallback to sample data for demo purposes
      const sampleProducts = getSampleProducts(searchQuery);
      setSearchResults(sampleProducts);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback function to get sample products based on search query
  const getSampleProducts = (query: string): Product[] => {
    const lowerQuery = query.toLowerCase();

    // Sample products for different categories
    if (lowerQuery.includes("toy") || lowerQuery.includes("game")) {
      return [
        {
          id: "toy1",
          name: "Funskool Monopoly Classic Board Game",
          price: 499,
          image:
            "https://images.unsplash.com/photo-1611371805429-8b5c1f0536fc?w=400&q=80",
          rating: 4.7,
          reviews: 3254,
        },
        {
          id: "toy2",
          name: "Lego Classic Creative Brick Box Building Set",
          price: 1999,
          image:
            "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80",
          rating: 4.9,
          reviews: 8721,
        },
        {
          id: "toy3",
          name: "Nerf Elite Disruptor Blaster",
          price: 799,
          image:
            "https://images.unsplash.com/photo-1563396983906-b3795482a59a?w=400&q=80",
          rating: 4.5,
          reviews: 2145,
        },
        {
          id: "toy4",
          name: "Mattel Barbie Dreamhouse Playset",
          price: 3999,
          image:
            "https://images.unsplash.com/photo-1558679928-be7e02981a07?w=400&q=80",
          rating: 4.6,
          reviews: 1876,
        },
      ];
    } else if (
      lowerQuery.includes("electronics") ||
      lowerQuery.includes("phone") ||
      lowerQuery.includes("laptop")
    ) {
      return [
        {
          id: "elec1",
          name: "Samsung Galaxy M34 5G (8GB, 128GB)",
          price: 18999,
          image:
            "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80",
          rating: 4.3,
          reviews: 7823,
        },
        {
          id: "elec2",
          name: "HP 15s Thin & Light Laptop (11th Gen i5)",
          price: 54990,
          image:
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80",
          rating: 4.2,
          reviews: 3421,
        },
        {
          id: "elec3",
          name: "boAt Rockerz 450 Bluetooth Headphone",
          price: 1499,
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
          rating: 4.4,
          reviews: 12543,
        },
      ];
    } else if (
      lowerQuery.includes("kitchen") ||
      lowerQuery.includes("appliance")
    ) {
      return [
        {
          id: "kitchen1",
          name: "Prestige Electric Rice Cooker (1.8 Litre)",
          price: 2499,
          image:
            "https://images.unsplash.com/photo-1544233726-9f1d0a5f2830?w=400&q=80",
          rating: 4.5,
          reviews: 8546,
        },
        {
          id: "kitchen2",
          name: "Bajaj Mixer Grinder with 3 Jars",
          price: 1995,
          image:
            "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80",
          rating: 4.3,
          reviews: 6723,
        },
        {
          id: "kitchen3",
          name: "Philips Air Fryer HD9252/90",
          price: 7999,
          image:
            "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400&q=80",
          rating: 4.7,
          reviews: 5238,
        },
      ];
    } else {
      // Default products for any other search
      return [
        {
          id: "default1",
          name: `${query} - Premium Quality Product`,
          price: 1299,
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
          rating: 4.2,
          reviews: 2723,
        },
        {
          id: "default2",
          name: `Best Selling ${query} on Amazon.in`,
          price: 2499,
          image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
          rating: 4.5,
          reviews: 8546,
        },
        {
          id: "default3",
          name: `${query} - New 2023 Model`,
          price: 3999,
          image:
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",
          rating: 4.7,
          reviews: 5238,
        },
      ];
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddToRegistry = async () => {
    if (!selectedProduct) return;

    try {
      setIsLoading(true);

      // Create item object
      const itemData = {
        registry_id: "new-registry", // In a real app, this would be the actual registry ID
        name: selectedProduct.name,
        price: selectedProduct.price,
        image_url: selectedProduct.image,
        priority,
        note: note || null,
        quantity,
      };

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);

        // Show success message
        toast({
          title: "Item added to registry",
          description: `${selectedProduct.name} has been added to your registry.`,
        });

        // Navigate back to registry
        navigate("/registry/new-registry/dashboard");
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to add item to registry. Please try again.",
        variant: "destructive",
      });
      console.error("Error adding item to registry:", error);
    }
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/registry/new-registry/dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Registry
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold tracking-tight">
              Add Item from Amazon.in
            </h1>
            <Button variant="outline" asChild>
              <Link to={`/registry/new-registry/add-manual-item`}>
                Add Item Manually
              </Link>
            </Button>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Search Amazon.in Products</CardTitle>
              <CardDescription>
                Find products you want to add to your registry from Amazon.in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Search for products on Amazon.in..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={!searchQuery.trim() || isLoading}
                >
                  {isLoading ? (
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
                      Searching...
                    </span>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search Amazon.in
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {isLoading && searchResults.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Search Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((product) => (
                  <Card
                    key={product.id}
                    className={`cursor-pointer transition-all ${selectedProduct?.id === product.id ? "ring-2 ring-primary" : "hover:shadow-md"}`}
                    onClick={() => handleSelectProduct(product)}
                  >
                    <div className="flex p-4 gap-4">
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-lg font-bold mt-1">
                          ₹{product.price.toLocaleString()}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg"
                            alt="Amazon.in"
                            className="h-3 w-3 mr-1"
                          />
                          Amazon.in
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-500" : "text-gray-300"}`}
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground ml-1">
                            ({product.reviews.toLocaleString()})
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : searchQuery && !isLoading ? (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground mb-2">
                No products found for "{searchQuery}"
              </p>
              <p className="text-sm text-muted-foreground">
                Try a different search term or check your spelling
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  // Show generic products when no results are found
                  const genericProducts = getSampleProducts("popular items");
                  setSearchResults(genericProducts);
                }}
              >
                Show popular products
              </Button>
            </div>
          ) : null}
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
              <CardDescription>
                Customize details before adding to your registry.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedProduct ? (
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-20 h-20 flex-shrink-0">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{selectedProduct.name}</h3>
                      <p className="text-lg font-bold mt-1">
                        ₹{selectedProduct.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <RadioGroup
                      id="priority"
                      value={priority}
                      onValueChange={setPriority}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="High" id="high" />
                        <Label htmlFor="high">High</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Medium" id="medium" />
                        <Label htmlFor="medium">Medium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Low" id="low" />
                        <Label htmlFor="low">Low</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(parseInt(e.target.value) || 1)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note">Personal Note (Optional)</Label>
                    <Textarea
                      id="note"
                      placeholder="Add a note about this item"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    Select a product from the search results to add it to your
                    registry.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={!selectedProduct || isLoading}
                onClick={handleAddToRegistry}
              >
                {isLoading ? (
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
                    Adding to Registry...
                  </span>
                ) : (
                  "Add to Registry"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
