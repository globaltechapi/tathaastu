import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Search, Star, ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  searchAmazonProducts,
  addAmazonProductToRegistry,
} from "@/services/amazonService";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export default function AddItemPage() {
  const navigate = useNavigate();
  const { id: registryId } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [priority, setPriority] = useState("Medium");
  const [note, setNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults([]);

    try {
      const products = await searchAmazonProducts(searchQuery);
      setSearchResults(products);
    } catch (error) {
      console.error("Error searching products:", error);
      toast({
        title: "Search failed",
        description: "Failed to search for products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    // Scroll to the product details section
    document
      .getElementById("product-details")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAddToRegistry = async () => {
    if (!selectedProduct || !registryId) return;

    setIsAdding(true);

    try {
      await addAmazonProductToRegistry(
        selectedProduct,
        registryId,
        priority,
        note,
      );

      toast({
        title: "Item added",
        description: `${selectedProduct.name} has been added to your registry.`,
      });

      // Navigate back to registry dashboard
      navigate(`/registry/${registryId}/dashboard`);
    } catch (error) {
      console.error("Error adding item to registry:", error);
      toast({
        title: "Failed to add item",
        description:
          "There was an error adding this item to your registry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(`/registry/${registryId}/dashboard`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Registry
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-semibold tracking-tight mb-6">
            Add Amazon Item to Registry
          </h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Search Amazon Products</CardTitle>
              <CardDescription>
                Search for products to add to your registry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search for products..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                >
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {isSearching ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4">Searching Amazon products...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Search Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((product) => (
                  <Card
                    key={product.id}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${selectedProduct?.id === product.id ? "ring-2 ring-primary" : ""}`}
                    onClick={() => handleSelectProduct(product)}
                  >
                    <div className="flex p-4 gap-4">
                      <div className="w-20 h-20 flex-shrink-0">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              `https://placehold.co/200x200/e2e8f0/64748b?text=${encodeURIComponent(product.name.substring(0, 10))}`;
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-lg font-bold mt-1">
                          ₹{product.price.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < Math.floor(product.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({product.reviews.toLocaleString()})
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : searchQuery && !isSearching ? (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground">
                No products found for "{searchQuery}"
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try a different search term or browse categories
              </p>
            </div>
          ) : null}

          {selectedProduct && (
            <div id="product-details" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>
                    Configure this item before adding to your registry
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-6">
                    <div className="w-32 h-32 flex-shrink-0">
                      <img
                        src={selectedProduct.image_url}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            `https://placehold.co/200x200/e2e8f0/64748b?text=${encodeURIComponent(selectedProduct.name.substring(0, 10))}`;
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">
                        {selectedProduct.name}
                      </h3>
                      <p className="text-xl font-bold mt-1">
                        ₹{selectedProduct.price.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(selectedProduct.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({selectedProduct.reviews.toLocaleString()} reviews)
                        </span>
                      </div>
                      {selectedProduct.prime && (
                        <div className="mt-2">
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-800 border-blue-200"
                          >
                            Prime Eligible
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <RadioGroup
                      id="priority"
                      value={priority}
                      onValueChange={setPriority}
                      className="flex space-x-4"
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
                    <Label htmlFor="note">Personal Note (Optional)</Label>
                    <Textarea
                      id="note"
                      placeholder="Add a note about this item"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleAddToRegistry}
                    disabled={isAdding}
                    className="w-full"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {isAdding ? "Adding to Registry..." : "Add to Registry"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Popular Categories</CardTitle>
              <CardDescription>
                Browse popular product categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "Electronics",
                  "Home & Kitchen",
                  "Books",
                  "Fashion",
                  "Beauty & Personal Care",
                  "Toys & Games",
                  "Sports & Fitness",
                  "Baby Products",
                ].map((category) => (
                  <Button
                    key={category}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setSearchQuery(category);
                      handleSearch({ preventDefault: () => {} });
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
