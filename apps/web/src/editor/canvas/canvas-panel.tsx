"use client";

import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { PanelHeader } from "@/editor/layout/panel-header";
import { useEditorStore } from "@/editor/store/editor-store";
import { AppRuntimeProvider } from "@/runtime/app-runtime-provider";
import { CANVAS_DROPPABLE_ID } from "./drop-action";
import { SortableWidget } from "./sortable-widget";

export function CanvasPanel({ role }: { role: string }) {
  const config = useEditorStore((state) => state.config);
  const selectedId = useEditorStore((state) => state.selectedId);
  const selectNode = useEditorStore((state) => state.selectNode);
  const removeWidget = useEditorStore((state) => state.removeWidget);
  const { setNodeRef } = useDroppable({ id: CANVAS_DROPPABLE_ID });

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") selectNode(null);
    if (event.key === "Delete" && selectedId) removeWidget(selectedId);
  };

  return (
    <section aria-label="Canvas" className="flex h-full min-h-0 flex-col bg-surface">
      <PanelHeader title="Canvas" />
      <div
        ref={setNodeRef}
        onClick={() => selectNode(null)}
        onKeyDown={handleKeyDown}
        className="min-h-0 flex-1 overflow-auto p-4"
      >
        <AppRuntimeProvider config={config} role={role}>
          <SortableContext items={config.widgets} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              {config.widgets.map((widget) => (
                <SortableWidget key={widget.id} widget={widget} />
              ))}
            </div>
          </SortableContext>
        </AppRuntimeProvider>
      </div>
    </section>
  );
}
