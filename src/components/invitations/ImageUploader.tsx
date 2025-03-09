import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

type ImageUploaderProps = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

export function ImageUploader({ value, onChange, label }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In a real implementation, this would upload to a storage service
  // For this demo, we'll just simulate an upload delay and use the URL directly
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      setIsUploading(false);
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      setIsUploading(false);
      return;
    }

    // Simulate upload delay
    setTimeout(() => {
      // In a real app, we would upload to a server and get a URL back
      // For demo purposes, we'll create a local object URL
      const imageUrl = URL.createObjectURL(file);
      onChange(imageUrl);
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => onChange("")}
            disabled={!value}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Button
              variant="outline"
              className="relative overflow-hidden"
              disabled={isUploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Image"}
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleUpload}
                accept="image/*"
                disabled={isUploading}
              />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Max size: 5MB. Supported formats: JPG, PNG, GIF
          </p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {value && (
          <div className="mt-2">
            <div className="aspect-video w-full max-w-xs rounded-md overflow-hidden border">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => {
                  setError("Invalid image URL");
                  onChange("");
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
