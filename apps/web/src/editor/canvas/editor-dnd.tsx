"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useReducedMotion } from "motion/react";
import { useState } from "react";
import { useEditorStore } from "@/editor/store/editor-store";
import { resolveDrop } from "./drop-action";

const DRAG_START_DISTANCE_PX = 6;

export function EditorDnd({ children }: { children: React.ReactNode }) {
  const widgets = useEditorStore((state) => state.config.widgets);
  const moveWidget = useEditorStore((state) => state.moveWidget);
  const shouldReduceMotion = useReducedMotion();
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: DRAG_START_DISTANCE_PX } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveLabel(String(active.data.current?.label ?? active.id));
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveLabel(null);
    const action = resolveDrop(
      widgets.map((widget) => widget.id),
      String(active.id),
      over ? String(over.id) : null,
    );
    if (action) moveWidget(action.from, action.to);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveLabel(null)}
    >
      {children}
      <DragOverlay dropAnimation={shouldReduceMotion ? null : undefined}>
        {activeLabel && (
          <div className="scale-[1.02] rounded-lg border bg-card px-3 py-2 text-sm font-medium shadow-lg">
            {activeLabel}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
