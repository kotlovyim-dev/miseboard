"use client";

import { useDraggable } from "@dnd-kit/core";
import { useEditorStore } from "@/editor/store/editor-store";
import { widgetRegistry } from "@/widgets/registry";
import type { PaletteEntry } from "./palette-groups";

export function PaletteItem({ type, hint, Icon }: PaletteEntry) {
  const addWidget = useEditorStore((state) => state.addWidget);
  const label = widgetRegistry[type]?.label ?? type;
  const { setNodeRef, listeners, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { label, paletteType: type },
  });

  return (
    <button
      type="button"
      ref={setNodeRef}
      {...listeners}
      onKeyDown={undefined}
      onClick={() => addWidget(type)}
      className="flex w-full items-center gap-2.5 rounded-md border border-transparent px-2 py-1.5 text-left outline-none hover:border-border hover:bg-card focus-visible:ring-2 focus-visible:ring-ring data-[dragging=true]:opacity-50"
      data-dragging={isDragging}
    >
      <Icon aria-hidden className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
      <span className="min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        <span className="block truncate text-xs text-muted-foreground">{hint}</span>
      </span>
    </button>
  );
}
