import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

export type InvitationTemplate = {
  id: string;
  name: string;
  previewImage: string;
  description: string;
  category:
    | "Wedding"
    | "Birthday"
    | "Baby Shower"
    | "Housewarming"
    | "General"
    | "Festive";
  colors: string[];
};

const templates: InvitationTemplate[] = [
  // Wedding Templates
  {
    id: "elegant-floral",
    name: "Elegant Floral",
    previewImage:
      "https://images.unsplash.com/photo-1515607833963-0a73a4fb333e?w=400&q=80",
    description: "A beautiful floral design with elegant typography",
    category: "Wedding",
    colors: ["#f8e5e5", "#f9c5d1", "#ea9ab2", "#2a363b"],
  },
  {
    id: "romantic-roses",
    name: "Romantic Roses",
    previewImage:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&q=80",
    description: "Romantic rose-themed design for weddings",
    category: "Wedding",
    colors: ["#f8b195", "#f67280", "#c06c84", "#355c7d"],
  },
  {
    id: "classic-wedding",
    name: "Classic Wedding",
    previewImage:
      "https://images.unsplash.com/photo-1519741347686-c1e331c20a2d?w=400&q=80",
    description: "Timeless classic design for traditional weddings",
    category: "Wedding",
    colors: ["#f5f5f5", "#e5e5e5", "#333333", "#000000"],
  },
  {
    id: "beach-wedding",
    name: "Beach Wedding",
    previewImage:
      "https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=400&q=80",
    description: "Coastal-inspired design for beach weddings",
    category: "Wedding",
    colors: ["#cae8d5", "#84a9ac", "#3b6978", "#204051"],
  },
  {
    id: "rustic-wedding",
    name: "Rustic Wedding",
    previewImage:
      "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=400&q=80",
    description: "Rustic charm for countryside weddings",
    category: "Wedding",
    colors: ["#e6ccb2", "#ddb892", "#b08968", "#7f5539"],
  },
  {
    id: "vintage-wedding",
    name: "Vintage Wedding",
    previewImage:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80",
    description: "Vintage-inspired design with retro elements",
    category: "Wedding",
    colors: ["#e8d6cb", "#d0ada7", "#ad6a6c", "#5d4954"],
  },
  {
    id: "modern-wedding",
    name: "Modern Wedding",
    previewImage:
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=400&q=80",
    description: "Contemporary design for modern couples",
    category: "Wedding",
    colors: ["#ffffff", "#f0f0f0", "#404040", "#000000"],
  },
  {
    id: "garden-wedding",
    name: "Garden Wedding",
    previewImage:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80",
    description: "Lush garden-inspired design for outdoor weddings",
    category: "Wedding",
    colors: ["#e4f5e1", "#a7e8bd", "#57c84d", "#2a5e45"],
  },
  {
    id: "gold-wedding",
    name: "Gold Elegance",
    previewImage:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80",
    description: "Luxurious gold-themed design for elegant weddings",
    category: "Wedding",
    colors: ["#f5e1a4", "#e6c677", "#9e7e38", "#4a3f35"],
  },
  {
    id: "watercolor-wedding",
    name: "Watercolor Dream",
    previewImage:
      "https://images.unsplash.com/photo-1501901609772-df0848060b33?w=400&q=80",
    description: "Dreamy watercolor design for artistic weddings",
    category: "Wedding",
    colors: ["#e3f6f5", "#bae8e8", "#2c698d", "#272643"],
  },

  // Birthday Templates
  {
    id: "festive-celebration",
    name: "Festive Celebration",
    previewImage:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80",
    description: "Colorful and festive design for celebrations",
    category: "Birthday",
    colors: ["#ffd700", "#ff6b6b", "#4ecdc4", "#292f36"],
  },
  {
    id: "balloon-party",
    name: "Balloon Party",
    previewImage:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80",
    description: "Fun balloon-themed design for birthday parties",
    category: "Birthday",
    colors: ["#ffadad", "#ffd6a5", "#fdffb6", "#9bf6ff"],
  },
  {
    id: "confetti-birthday",
    name: "Confetti Blast",
    previewImage:
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&q=80",
    description: "Vibrant confetti design for exciting celebrations",
    category: "Birthday",
    colors: ["#ffbe0b", "#fb5607", "#ff006e", "#8338ec"],
  },
  {
    id: "cake-birthday",
    name: "Cake Celebration",
    previewImage:
      "https://images.unsplash.com/photo-1578922746465-3a80a228f223?w=400&q=80",
    description: "Delicious cake-themed design for sweet celebrations",
    category: "Birthday",
    colors: ["#f9c5d5", "#f2a6c2", "#ea7a9a", "#ce4257"],
  },
  {
    id: "neon-birthday",
    name: "Neon Nights",
    previewImage:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80",
    description: "Glowing neon design for evening birthday parties",
    category: "Birthday",
    colors: ["#2d00f7", "#6a00f4", "#8900f2", "#bc00dd"],
  },
  {
    id: "retro-birthday",
    name: "Retro Vibes",
    previewImage:
      "https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?w=400&q=80",
    description: "Vintage retro design for nostalgic celebrations",
    category: "Birthday",
    colors: ["#f9c80e", "#f86624", "#ea3546", "#662e9b"],
  },
  {
    id: "minimalist-birthday",
    name: "Minimalist Birthday",
    previewImage:
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&q=80",
    description: "Clean, simple design for sophisticated birthdays",
    category: "Birthday",
    colors: ["#ffffff", "#f5f5f5", "#333333", "#000000"],
  },
  {
    id: "tropical-birthday",
    name: "Tropical Paradise",
    previewImage:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&q=80",
    description: "Exotic tropical design for summer birthday parties",
    category: "Birthday",
    colors: ["#ff7b00", "#ff8800", "#ff9500", "#ff9e00"],
  },
  {
    id: "galaxy-birthday",
    name: "Galaxy Adventure",
    previewImage:
      "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&q=80",
    description: "Cosmic space-themed design for out-of-this-world parties",
    category: "Birthday",
    colors: ["#2d3561", "#c05c7e", "#f3826f", "#ffce56"],
  },
  {
    id: "elegant-birthday",
    name: "Elegant Birthday",
    previewImage:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80",
    description: "Sophisticated design for elegant birthday celebrations",
    category: "Birthday",
    colors: ["#f0ead6", "#dfd3c3", "#c7b198", "#596e79"],
  },

  // Baby Shower Templates
  {
    id: "baby-pastel",
    name: "Baby Pastel",
    previewImage:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=80",
    description: "Soft pastel colors perfect for baby showers",
    category: "Baby Shower",
    colors: ["#d4f0f0", "#8fcaca", "#cce2cb", "#ffd1dc"],
  },
  {
    id: "baby-blue",
    name: "Baby Blue",
    previewImage:
      "https://images.unsplash.com/photo-1544776193-0dd2b5846b5d?w=400&q=80",
    description: "Gentle blue tones for boy baby showers",
    category: "Baby Shower",
    colors: ["#e3f2fd", "#bbdefb", "#90caf9", "#2196f3"],
  },
  {
    id: "baby-pink",
    name: "Baby Pink",
    previewImage:
      "https://images.unsplash.com/photo-1554342872-034a06541948?w=400&q=80",
    description: "Soft pink design for girl baby showers",
    category: "Baby Shower",
    colors: ["#fce4ec", "#f8bbd0", "#f48fb1", "#ec407a"],
  },
  {
    id: "gender-neutral",
    name: "Gender Neutral",
    previewImage:
      "https://images.unsplash.com/photo-1616038242814-a6eac7845d88?w=400&q=80",
    description: "Neutral colors for gender-neutral baby showers",
    category: "Baby Shower",
    colors: ["#f1f8e9", "#dcedc8", "#c5e1a5", "#9ccc65"],
  },
  {
    id: "teddy-bear",
    name: "Teddy Bear",
    previewImage:
      "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=400&q=80",
    description: "Cute teddy bear themed design for baby showers",
    category: "Baby Shower",
    colors: ["#f5e9d9", "#e6ccb2", "#b08968", "#7f5539"],
  },
  {
    id: "stork-delivery",
    name: "Stork Delivery",
    previewImage:
      "https://images.unsplash.com/photo-1518599807935-37015b9cefcb?w=400&q=80",
    description: "Classic stork-themed design for traditional baby showers",
    category: "Baby Shower",
    colors: ["#e1f5fe", "#b3e5fc", "#81d4fa", "#29b6f6"],
  },
  {
    id: "baby-animals",
    name: "Baby Animals",
    previewImage:
      "https://images.unsplash.com/photo-1566139884330-9bc23ff60d97?w=400&q=80",
    description: "Adorable baby animals design for cute baby showers",
    category: "Baby Shower",
    colors: ["#ffebee", "#ffcdd2", "#ef9a9a", "#e57373"],
  },
  {
    id: "baby-blocks",
    name: "Baby Blocks",
    previewImage:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80",
    description: "Playful building blocks design for interactive baby showers",
    category: "Baby Shower",
    colors: ["#e8f5e9", "#c8e6c9", "#a5d6a7", "#81c784"],
  },
  {
    id: "baby-stars",
    name: "Twinkle Stars",
    previewImage:
      "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&q=80",
    description: "Starry night design for dreamy baby showers",
    category: "Baby Shower",
    colors: ["#e8eaf6", "#c5cae9", "#9fa8da", "#7986cb"],
  },
  {
    id: "baby-rainbow",
    name: "Rainbow Baby",
    previewImage:
      "https://images.unsplash.com/photo-1508697014387-db70aad34f4d?w=400&q=80",
    description: "Colorful rainbow design for celebrating rainbow babies",
    category: "Baby Shower",
    colors: ["#ffcdd2", "#c8e6c9", "#b3e5fc", "#d1c4e9"],
  },

  // Housewarming Templates
  {
    id: "rustic-charm",
    name: "Rustic Charm",
    previewImage:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80",
    description: "Warm, rustic design with natural elements",
    category: "Housewarming",
    colors: ["#e6ccb2", "#ddb892", "#b08968", "#7f5539"],
  },
  {
    id: "modern-home",
    name: "Modern Home",
    previewImage:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80",
    description: "Contemporary design for modern home celebrations",
    category: "Housewarming",
    colors: ["#f5f5f5", "#e0e0e0", "#9e9e9e", "#212121"],
  },
  {
    id: "cozy-cottage",
    name: "Cozy Cottage",
    previewImage:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&q=80",
    description: "Warm and inviting design for cozy new homes",
    category: "Housewarming",
    colors: ["#ffe8d6", "#ddbea9", "#cb997e", "#6b705c"],
  },
  {
    id: "urban-loft",
    name: "Urban Loft",
    previewImage:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80",
    description: "Industrial chic design for urban apartments",
    category: "Housewarming",
    colors: ["#d8d8d8", "#b0b0b0", "#707070", "#404040"],
  },
  {
    id: "garden-home",
    name: "Garden Home",
    previewImage:
      "https://images.unsplash.com/photo-1558521958-0a228582e931?w=400&q=80",
    description: "Lush garden-inspired design for homes with outdoor spaces",
    category: "Housewarming",
    colors: ["#e9f5db", "#cfe1b9", "#b5c99a", "#97a97c"],
  },
  {
    id: "beach-house",
    name: "Beach House",
    previewImage:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&q=80",
    description: "Coastal design for beach houses and waterfront properties",
    category: "Housewarming",
    colors: ["#e0fbfc", "#98c1d9", "#3d5a80", "#293241"],
  },
  {
    id: "mountain-cabin",
    name: "Mountain Cabin",
    previewImage:
      "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=400&q=80",
    description: "Rustic mountain-inspired design for cabins and chalets",
    category: "Housewarming",
    colors: ["#edede9", "#d6ccc2", "#a68a64", "#6c584c"],
  },
  {
    id: "minimalist-home",
    name: "Minimalist Home",
    previewImage:
      "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&q=80",
    description: "Clean, minimalist design for simple, elegant homes",
    category: "Housewarming",
    colors: ["#ffffff", "#f5f5f5", "#e0e0e0", "#212121"],
  },
  {
    id: "vintage-home",
    name: "Vintage Home",
    previewImage:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80",
    description: "Nostalgic vintage-inspired design for character homes",
    category: "Housewarming",
    colors: ["#f2e9e4", "#c9ada7", "#9a8c98", "#4a4e69"],
  },
  {
    id: "bohemian-home",
    name: "Bohemian Home",
    previewImage:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80",
    description: "Free-spirited bohemian design for eclectic homes",
    category: "Housewarming",
    colors: ["#ffcdb2", "#ffb4a2", "#e5989b", "#b5838d"],
  },

  // General Templates
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    previewImage:
      "https://images.unsplash.com/photo-1550493355-54d41f360ed8?w=400&q=80",
    description: "Clean, modern design with minimalist aesthetic",
    category: "General",
    colors: ["#ffffff", "#f5f5f5", "#333333", "#000000"],
  },
  {
    id: "elegant-script",
    name: "Elegant Script",
    previewImage:
      "https://images.unsplash.com/photo-1544776193-0dd2b5846b5d?w=400&q=80",
    description: "Sophisticated design with elegant typography",
    category: "General",
    colors: ["#f8f9fa", "#e9ecef", "#6c757d", "#212529"],
  },
  {
    id: "geometric-pattern",
    name: "Geometric Pattern",
    previewImage:
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&q=80",
    description: "Modern design with geometric patterns and shapes",
    category: "General",
    colors: ["#f8f9fa", "#dee2e6", "#6c757d", "#343a40"],
  },
  {
    id: "watercolor-abstract",
    name: "Watercolor Abstract",
    previewImage:
      "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=400&q=80",
    description: "Artistic design with watercolor abstract elements",
    category: "General",
    colors: ["#edf6f9", "#83c5be", "#006d77", "#e29578"],
  },
  {
    id: "classic-border",
    name: "Classic Border",
    previewImage:
      "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=400&q=80",
    description: "Traditional design with elegant borders",
    category: "General",
    colors: ["#f1faee", "#a8dadc", "#457b9d", "#1d3557"],
  },
  {
    id: "photo-frame",
    name: "Photo Frame",
    previewImage:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=400&q=80",
    description: "Design with space for a personal photo",
    category: "General",
    colors: ["#f7ede2", "#f5cac3", "#84a59d", "#f28482"],
  },
  {
    id: "gradient-blend",
    name: "Gradient Blend",
    previewImage:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
    description: "Modern design with smooth color gradients",
    category: "General",
    colors: ["#d8f3dc", "#95d5b2", "#52b788", "#1b4332"],
  },
  {
    id: "marble-texture",
    name: "Marble Texture",
    previewImage:
      "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=400&q=80",
    description: "Luxurious design with marble texture background",
    category: "General",
    colors: ["#f8f9fa", "#e9ecef", "#adb5bd", "#212529"],
  },
  {
    id: "botanical-green",
    name: "Botanical Green",
    previewImage:
      "https://images.unsplash.com/photo-1533038590840-1f130a3120cb?w=400&q=80",
    description: "Fresh design with botanical elements and greenery",
    category: "General",
    colors: ["#f1faee", "#d8f3dc", "#95d5b2", "#2d6a4f"],
  },
  {
    id: "monochrome",
    name: "Monochrome",
    previewImage:
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80",
    description: "Sleek black and white design for a timeless look",
    category: "General",
    colors: ["#ffffff", "#e0e0e0", "#9e9e9e", "#000000"],
  },

  // Festive Templates
  {
    id: "diwali-special",
    name: "Diwali Special",
    previewImage:
      "https://images.unsplash.com/photo-1605021154242-affb1448e3a4?w=400&q=80",
    description: "Vibrant and festive Diwali-themed design",
    category: "Festive",
    colors: ["#ff9933", "#ffcc33", "#990033", "#138808"],
  },
  {
    id: "christmas-joy",
    name: "Christmas Joy",
    previewImage:
      "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=400&q=80",
    description: "Festive Christmas design with holiday elements",
    category: "Festive",
    colors: ["#d8f3dc", "#b7e4c7", "#d62828", "#003049"],
  },
  {
    id: "new-year-celebration",
    name: "New Year Celebration",
    previewImage:
      "https://images.unsplash.com/photo-1546074177-31bfa593f731?w=400&q=80",
    description: "Celebratory design for New Year's events",
    category: "Festive",
    colors: ["#f8f9fa", "#e9ecef", "#6c757d", "#212529"],
  },
  {
    id: "holi-colors",
    name: "Holi Colors",
    previewImage:
      "https://images.unsplash.com/photo-1551893134-6f03a8f9c04a?w=400&q=80",
    description: "Vibrant colorful design inspired by the Holi festival",
    category: "Festive",
    colors: ["#ff9999", "#99ff99", "#9999ff", "#ffff99"],
  },
  {
    id: "halloween-spooky",
    name: "Halloween Spooky",
    previewImage:
      "https://images.unsplash.com/photo-1508361001413-7a9dca21d08a?w=400&q=80",
    description: "Spooky design for Halloween celebrations",
    category: "Festive",
    colors: ["#ff6700", "#eeeeee", "#202020", "#0d0d0d"],
  },
  {
    id: "thanksgiving-autumn",
    name: "Thanksgiving Autumn",
    previewImage:
      "https://images.unsplash.com/photo-1510265236892-329bfd7de7a1?w=400&q=80",
    description: "Warm autumn design for Thanksgiving gatherings",
    category: "Festive",
    colors: ["#e6b89c", "#eda268", "#d9582b", "#9e2a2b"],
  },
  {
    id: "easter-spring",
    name: "Easter Spring",
    previewImage:
      "https://images.unsplash.com/photo-1552424519-ed796c5b4dd9?w=400&q=80",
    description: "Fresh spring design for Easter celebrations",
    category: "Festive",
    colors: ["#ffcfd2", "#f1c0e8", "#cfbaf0", "#a3c4f3"],
  },
  {
    id: "eid-celebration",
    name: "Eid Celebration",
    previewImage:
      "https://images.unsplash.com/photo-1563889362352-b0492c224f62?w=400&q=80",
    description: "Elegant design for Eid festivities",
    category: "Festive",
    colors: ["#f8ede3", "#dfd3c3", "#85586f", "#643843"],
  },
  {
    id: "chinese-new-year",
    name: "Chinese New Year",
    previewImage:
      "https://images.unsplash.com/photo-1578495547818-7ac49eeb1558?w=400&q=80",
    description: "Traditional design for Chinese New Year celebrations",
    category: "Festive",
    colors: ["#f1c0e8", "#ffcfd2", "#fbf8cc", "#ff0000"],
  },
  {
    id: "valentines-day",
    name: "Valentine's Day",
    previewImage:
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80",
    description: "Romantic design for Valentine's Day celebrations",
    category: "Festive",
    colors: ["#ffccd5", "#ffb3c1", "#ff8fa3", "#fb6f92"],
  },
];

type InvitationTemplatesProps = {
  onSelectTemplate: (template: InvitationTemplate) => void;
  selectedTemplateId?: string;
};

export default function InvitationTemplates({
  onSelectTemplate,
  selectedTemplateId,
}: InvitationTemplatesProps) {
  const [filter, setFilter] = useState<string>("All");

  const filteredTemplates =
    filter === "All"
      ? templates
      : templates.filter((template) => template.category === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 sticky top-0 bg-white z-10 py-2 border-b">
        <Button
          variant={filter === "All" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("All")}
        >
          All
        </Button>
        <Button
          variant={filter === "Wedding" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("Wedding")}
        >
          Wedding
        </Button>
        <Button
          variant={filter === "Birthday" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("Birthday")}
        >
          Birthday
        </Button>
        <Button
          variant={filter === "Baby Shower" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("Baby Shower")}
        >
          Baby Shower
        </Button>
        <Button
          variant={filter === "Housewarming" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("Housewarming")}
        >
          Housewarming
        </Button>
        <Button
          variant={filter === "Festive" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("Festive")}
        >
          Festive
        </Button>
        <Button
          variant={filter === "General" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("General")}
        >
          General
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all overflow-hidden ${selectedTemplateId === template.id ? "ring-2 ring-primary" : "hover:shadow-md"}`}
            onClick={() => onSelectTemplate(template)}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                src={template.previewImage}
                alt={template.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Replace with a fallback image if loading fails
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/400x300/e2e8f0/64748b?text=Template+Preview";
                }}
              />
              {selectedTemplateId === template.id && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
              <div className="flex mt-2 gap-1">
                {template.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
