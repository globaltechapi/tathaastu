import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { InvitationTemplate } from "./InvitationTemplates";
import { ColorPicker } from "./ColorPicker";
import { FontSelector } from "./FontSelector";
import { ImageUploader } from "./ImageUploader";

type InvitationEditorProps = {
  template: InvitationTemplate;
  registryTitle: string;
  registryDate?: string;
  onSave: (designData: any) => void;
};

export default function InvitationEditor({
  template,
  registryTitle,
  registryDate,
  onSave,
}: InvitationEditorProps) {
  const [title, setTitle] = useState(registryTitle || "You're Invited!");
  const [subtitle, setSubtitle] = useState(
    "Please join us for a special celebration",
  );
  const [message, setMessage] = useState(
    "We've created a gift registry and would love for you to be a part of our special day. Click the link below to view our registry.",
  );
  const [date, setDate] = useState(registryDate || "");
  const [location, setLocation] = useState("");
  const [primaryColor, setPrimaryColor] = useState(template.colors[0]);
  const [secondaryColor, setSecondaryColor] = useState(template.colors[1]);
  const [accentColor, setAccentColor] = useState(template.colors[2]);
  const [textColor, setTextColor] = useState(template.colors[3]);
  const [font, setFont] = useState("Inter");
  const [fontSize, setFontSize] = useState(16);
  const [backgroundImage, setBackgroundImage] = useState(template.previewImage);

  // Update colors when template changes
  useEffect(() => {
    setPrimaryColor(template.colors[0]);
    setSecondaryColor(template.colors[1]);
    setAccentColor(template.colors[2]);
    setTextColor(template.colors[3]);
    setBackgroundImage(template.previewImage);
  }, [template]);

  const handleSave = () => {
    const designData = {
      templateId: template.id,
      title,
      subtitle,
      message,
      date,
      location,
      colors: {
        primary: primaryColor,
        secondary: secondaryColor,
        accent: accentColor,
        text: textColor,
      },
      font,
      fontSize,
      backgroundImage,
    };

    onSave(designData);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="content">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Invitation Title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Subtitle or tagline"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your invitation message"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date & Time (Optional)</Label>
              <Input
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g., June 15, 2024 at 6:00 PM"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Grand Ballroom, Taj Hotel"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="style" className="space-y-6 pt-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Secondary Color</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: secondaryColor }}
                  />
                  <Input
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: accentColor }}
                  />
                  <Input
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: textColor }}
                  />
                  <Input
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Typography</h3>
            <div className="space-y-2">
              <Label>Font</Label>
              <select
                value={font}
                onChange={(e) => setFont(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Lora">Lora</option>
                <option value="Poppins">Poppins</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Font Size: {fontSize}px</Label>
              </div>
              <Slider
                value={[fontSize]}
                min={12}
                max={24}
                step={1}
                onValueChange={(value) => setFontSize(value[0])}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Background</h3>
            <div className="space-y-2">
              <Label>Background Image URL</Label>
              <Input
                value={backgroundImage}
                onChange={(e) => setBackgroundImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="pt-4">
          <div className="border rounded-lg overflow-hidden">
            <div
              className="aspect-[3/4] w-full relative p-8 flex flex-col items-center justify-center text-center"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: textColor,
                fontFamily: font,
              }}
            >
              {/* Semi-transparent overlay */}
              <div
                className="absolute inset-0 opacity-70"
                style={{ backgroundColor: primaryColor }}
              />

              {/* Content */}
              <div className="relative z-10 max-w-md mx-auto">
                <div
                  className="text-3xl font-bold mb-2"
                  style={{ color: accentColor }}
                >
                  {title}
                </div>

                <div className="text-xl mb-6" style={{ color: secondaryColor }}>
                  {subtitle}
                </div>

                <div className="mb-6" style={{ fontSize: `${fontSize}px` }}>
                  {message}
                </div>

                {(date || location) && (
                  <div
                    className="p-4 rounded-lg mb-6 font-medium"
                    style={{ backgroundColor: `${secondaryColor}30` }}
                  >
                    {date && <div className="mb-1">{date}</div>}
                    {location && <div>{location}</div>}
                  </div>
                )}

                <Button
                  className="mt-4"
                  style={{
                    backgroundColor: accentColor,
                    color: primaryColor,
                  }}
                >
                  View Registry
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Design</Button>
      </div>
    </div>
  );
}
