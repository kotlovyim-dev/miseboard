import { PanelHeader } from "@/editor/layout/panel-header";
import { PALETTE_GROUPS } from "./palette-groups";
import { PaletteItem } from "./palette-item";

export function PalettePanel() {
  return (
    <section aria-label="Palette" className="flex h-full min-h-0 flex-col overflow-hidden">
      <PanelHeader title="Palette" />
      <div className="min-h-0 flex-1 space-y-4 overflow-auto p-2">
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
