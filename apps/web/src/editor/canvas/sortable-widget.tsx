"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { WidgetConfig } from "@miseboard/config";
import { GripVertical } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { IdChip } from "@/components/id-chip";
import { useEditorStore } from "@/editor/store/editor-store";
import { cn } from "@/lib/utils";
import { COLUMN_SPAN } from "@/runtime/app-grid";
import { WidgetRenderer } from "@/runtime/widget-renderer";

const REORDER_TRANSITION = { duration: 200, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" };

export function SortableWidget({ widget }: { widget: WidgetConfig }) {
  const isSelected = useEditorStore((state) => state.selectedId === widget.id);
  const selectNode = useEditorStore((state) => state.selectNode);
  const shouldReduceMotion = useReducedMotion();
  const {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: widget.id,
    data: { label: widget.id },
    transition: shouldReduceMotion ? null : REORDER_TRANSITION,
  });

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    selectNode(widget.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      onClick={handleClick}
      className={cn(
        "group relative min-w-0 rounded-lg",
        COLUMN_SPAN[widget.width],
        isSelected && "ring-2 ring-ring ring-offset-2 ring-offset-surface",
        isDragging && "opacity-40",
      )}
    >
      <div inert className="rounded-lg">
        <WidgetRenderer widget={widget} />
      </div>
      <button
        type="button"
        ref={setActivatorNodeRef}
        aria-label={`Move ${widget.id}`}
        onFocus={() => selectNode(widget.id)}
        {...attributes}
        {...listeners}
        className="absolute top-1.5 right-1.5 inline-flex size-6 cursor-grab items-center justify-center rounded-md text-muted-foreground opacity-0 outline-none group-hover:opacity-100 hover:bg-accent focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"
      >
        <GripVertical aria-hidden className="size-4" strokeWidth={1.5} />
      </button>
      <IdChip
        id={widget.id}
        className={cn(
          "absolute -top-2.5 left-2 hidden bg-card group-hover:inline-flex",
          isSelected && "inline-flex",
        )}
      />
    </div>
  );
}
