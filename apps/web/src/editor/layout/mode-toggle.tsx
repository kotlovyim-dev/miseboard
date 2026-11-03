"use client";

import { Eye, Pencil } from "lucide-react";
import { ToggleGroup } from "radix-ui";
import { useEditorStore } from "@/editor/store/editor-store";
import { cn } from "@/lib/utils";

const MODES = [
  { mode: "edit", label: "Edit", Icon: Pencil },
  { mode: "preview", label: "Preview", Icon: Eye },
] as const;

export function ModeToggle() {
  const mode = useEditorStore((state) => state.mode);
  const setMode = useEditorStore((state) => state.setMode);

  const handleChange = (next: string) => {
    const item = MODES.find((candidate) => candidate.mode === next);
    if (item) setMode(item.mode);
  };

  return (
    <ToggleGroup.Root
      type="single"
      value={mode}
      onValueChange={handleChange}
      aria-label="Editor mode"
      className="inline-flex h-7 items-center rounded-md bg-muted p-0.5"
    >
      {MODES.map(({ mode: itemMode, label, Icon }) => (
        <ToggleGroup.Item
          key={itemMode}
          value={itemMode}
          className={cn(
            "inline-flex h-6 items-center gap-1.5 rounded-sm px-2.5 text-sm font-medium text-muted-foreground outline-none transition-colors duration-150 motion-reduce:transition-none",
            "hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
            "data-[state=on]:bg-card data-[state=on]:text-foreground",
          )}
        >
          <Icon aria-hidden className="size-4" strokeWidth={1.5} />
          {label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
