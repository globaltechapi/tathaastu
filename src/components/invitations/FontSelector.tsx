import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FontSelectorProps = {
  value: string;
  onChange: (font: string) => void;
  label?: string;
};

export function FontSelector({ value, onChange, label }: FontSelectorProps) {
  const fonts = [
    { name: "Inter", family: "Inter, sans-serif" },
    { name: "Roboto", family: "Roboto, sans-serif" },
    { name: "Playfair Display", family: "'Playfair Display', serif" },
    { name: "Montserrat", family: "Montserrat, sans-serif" },
    { name: "Lora", family: "Lora, serif" },
    { name: "Poppins", family: "Poppins, sans-serif" },
    { name: "Open Sans", family: "'Open Sans', sans-serif" },
    { name: "Lato", family: "Lato, sans-serif" },
    { name: "Merriweather", family: "Merriweather, serif" },
    { name: "Raleway", family: "Raleway, sans-serif" },
  ];

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a font" />
        </SelectTrigger>
        <SelectContent>
          {fonts.map((font) => (
            <SelectItem key={font.name} value={font.name}>
              <span style={{ fontFamily: font.family }}>{font.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
