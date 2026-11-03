"use client";

import type { WidgetWidth } from "@miseboard/config";
import { ToggleGroup } from "radix-ui";
import { cn } from "@/lib/utils";

const WIDTHS: WidgetWidth[] = [3, 4, 6, 12];

interface WidthControlProps {
  width: WidgetWidth;
  onChange: (width: WidgetWidth) => void;
}

export function WidthControl({ width, onChange }: WidthControlProps) {
  const handleChange = (next: string) => {
    const selected = WIDTHS.find((candidate) => String(candidate) === next);
    if (selected) onChange(selected);
  };

  return (
    <ToggleGroup.Root
      type="single"
      value={String(width)}
      onValueChange={handleChange}
      aria-label="Width in columns"
      className="inline-flex h-7 items-center rounded-md bg-muted p-0.5"
    >
      {WIDTHS.map((option) => (
        <ToggleGroup.Item
          key={option}
          value={String(option)}
          className={cn(
            "inline-flex h-6 min-w-9 items-center justify-center rounded-sm px-2 text-sm font-medium text-muted-foreground tabular-nums outline-none transition-colors duration-150 motion-reduce:transition-none",
            "hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
            "data-[state=on]:bg-card data-[state=on]:text-foreground",
          )}
        >
          {option}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
