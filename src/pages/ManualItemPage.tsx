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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createRegistryItem } from "@/services/registryService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const platforms = [
  {
    id: "amazon",
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg",
  },
  {
    id: "flipkart",
    name: "Flipkart",
    logo: "https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Emblem.png",
  },
  {
    id: "myntra",
    name: "Myntra",
    logo: "https://aartisto.com/wp-content/uploads/2020/11/myntra.png",
  },
  {
    id: "snapdeal",
    name: "Snapdeal",
    logo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23e40046' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10' fill='%23e40046'/><path d='M8 14s1.5 2 4 2 4-2 4-2' stroke='white'/><line x1='9' y1='9' x2='9.01' y2='9' stroke='white' stroke-width='3'/><line x1='15' y1='9' x2='15.01' y2='9' stroke='white' stroke-width='3'/></svg>",
  },
  {
    id: "meesho",
    name: "Meesho",
    logo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23a83279' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10' fill='%23a83279'/><path d='M8 14s1.5 2 4 2 4-2 4-2' stroke='white'/><line x1='9' y1='9' x2='9.01' y2='9' stroke='white' stroke-width='3'/><line x1='15' y1='9' x2='15.01' y2='9' stroke='white' stroke-width='3'/></svg>",
  },
  {
    id: "tataneu",
    name: "Tata Neu",
    logo: "https://play-lh.googleusercontent.com/DTzWtkxfnKwFO3ruybY1SKjJQnLYeuK3KmQmwV5OQ3dULr5iXxeEtzBLceultrKTIUTr=w240-h480-rw",
  },
  {
    id: "ajio",
    name: "AJIO",
    logo: "https://assets.ajio.com/static/img/favicon.ico",
  },
  {
    id: "nykaa",
    name: "Nykaa",
    logo: "https://www.nykaa.com/media/favicon/default/nykaa_favicon.png",
  },
  { id: "other", name: "Other", logo: "" },
];

export default function ManualItemPage() {
  const navigate = useNavigate();
  const { id: registryId } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [platform, setPlatform] = useState("");
  const [productName, setProductName] = useState("");
  const [productLink, setProductLink] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productVariant, setProductVariant] = useState("");
  const [productImage, setProductImage] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform || !productName || !productPrice) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Use a default image if none provided
      const imageUrl =
        productImage ||
        `https://placehold.co/400x400/e2e8f0/64748b?text=${encodeURIComponent(productName)}`;

      // Create item in database
      await createRegistryItem({
        registry_id: registryId || "new-registry",
        name: productName,
        price: parseFloat(productPrice),
        image_url: imageUrl,
        priority,
        note: note || null,
        quantity,
        platform,
        product_link: productLink,
        variant: productVariant,
      });

      // Show success message
      toast({
        title: "Item added to registry",
        description: `${productName} has been added to your registry.`,
      });

      // Navigate back to registry
      navigate(`/registry/${registryId}/dashboard`);
    } catch (error) {
      console.error("Error adding item to registry:", error);
      toast({
        title: "Error",
        description: "Failed to add item to registry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPlatformLogo = (platformId: string) => {
    const platform = platforms.find((p) => p.id === platformId);
    return platform?.logo || "";
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
            Add Item Manually
          </h1>

          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Item Details</CardTitle>
                <CardDescription>
                  Enter the details of the item you want to add to your registry
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="platform">E-commerce Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger id="platform">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          <div className="flex items-center">
                            {p.logo && (
                              <img
                                src={p.logo}
                                alt={p.name}
                                className="h-4 w-4 mr-2"
                              />
                            )}
                            {p.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-name">Product Name*</Label>
                  <Input
                    id="product-name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g., Sony WH-1000XM4 Wireless Headphones"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-link">Product Link</Label>
                  <Input
                    id="product-link"
                    type="url"
                    value={productLink}
                    onChange={(e) => setProductLink(e.target.value)}
                    placeholder="https://www.example.com/product"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-price">Price (₹)*</Label>
                    <Input
                      id="product-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      placeholder="e.g., 1999.99"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-variant">Variant/Size/Color</Label>
                    <Input
                      id="product-variant"
                      value={productVariant}
                      onChange={(e) => setProductVariant(e.target.value)}
                      placeholder="e.g., Black, XL, 256GB"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-image">Image URL</Label>
                  <Input
                    id="product-image"
                    type="url"
                    value={productImage}
                    onChange={(e) => setProductImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to use a default image
                  </p>
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
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
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
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isLoading || !productName || !productPrice || !platform
                  }
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
            </form>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                How your item will appear in the registry
              </CardDescription>
            </CardHeader>
            <CardContent>
              {productName ? (
                <div className="space-y-4">
                  <div className="aspect-square w-full bg-muted rounded-md overflow-hidden">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={productName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No image provided
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium text-lg">{productName}</h3>
                    {productVariant && (
                      <p className="text-sm text-muted-foreground">
                        Variant: {productVariant}
                      </p>
                    )}
                    {productPrice && (
                      <p className="text-lg font-bold mt-1">
                        ₹{parseFloat(productPrice).toLocaleString()}
                      </p>
                    )}
                    {platform && (
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        {getPlatformLogo(platform) && (
                          <img
                            src={getPlatformLogo(platform)}
                            alt={platform}
                            className="h-3 w-3 mr-1"
                          />
                        )}
                        {platforms.find((p) => p.id === platform)?.name ||
                          platform}
                      </div>
                    )}
                    {priority && (
                      <div className="mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            priority === "High"
                              ? "bg-red-100 text-red-800"
                              : priority === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {priority} Priority
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    Fill in the product details to see a preview
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
