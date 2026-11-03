"use client";

import { PanelHeader } from "@/editor/layout/panel-header";
import { PALETTE_GROUPS } from "./palette-groups";
import { PaletteItem } from "./palette-item";

const ARROW_STEPS: Record<string, number> = { ArrowDown: 1, ArrowUp: -1 };

export function PalettePanel() {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = ARROW_STEPS[event.key];
    if (!step) return;
    const items = Array.from(event.currentTarget.querySelectorAll("button"));
    const index = items.findIndex((item) => item === document.activeElement);
    if (index === -1) return;
    event.preventDefault();
    items[(index + step + items.length) % items.length]?.focus();
  };

  return (
    <section aria-label="Palette" className="flex h-full min-h-0 flex-col overflow-hidden">
      <PanelHeader title="Palette" />
      <div onKeyDown={handleKeyDown} className="min-h-0 flex-1 space-y-4 overflow-auto p-2">
        {PALETTE_GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="px-2 pb-1 text-xs font-medium tracking-[0.06em] text-muted-foreground uppercase">
              {group.title}
            </h3>
            {group.entries.map((entry) => (
              <PaletteItem key={entry.type} {...entry} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
