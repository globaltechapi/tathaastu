import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type ColorPickerProps = {
  color: string;
  onChange: (color: string) => void;
  label?: string;
};

export function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const presetColors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#795548",
    "#9e9e9e",
    "#607d8b",
    "#000000",
    "#ffffff",
  ];

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <div
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: color }}
            />
            <Input
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="font-mono"
              onClick={() => setIsOpen(true)}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="space-y-3">
            <div className="grid grid-cols-7 gap-2">
              {presetColors.map((presetColor) => (
                <div
                  key={presetColor}
                  className="w-6 h-6 rounded-full border cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: presetColor }}
                  onClick={() => {
                    onChange(presetColor);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>
            <div>
              <Label htmlFor="custom-color">Custom Color</Label>
              <Input
                id="custom-color"
                type="color"
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="h-10 p-1"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
