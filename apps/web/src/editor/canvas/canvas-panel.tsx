"use client";

import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { PanelHeader } from "@/editor/layout/panel-header";
import { useDeleteWidget } from "@/editor/inspector/use-delete-widget";
import { useEditorStore } from "@/editor/store/editor-store";
import { CANVAS_DROPPABLE_ID } from "./drop-action";
import { EmptyCanvas } from "./empty-canvas";
import { SortableWidget } from "./sortable-widget";

export function CanvasPanel() {
  const config = useEditorStore((state) => state.config);
  const selectedId = useEditorStore((state) => state.selectedId);
  const selectNode = useEditorStore((state) => state.selectNode);
  const deleteWidget = useDeleteWidget();
  const { setNodeRef } = useDroppable({ id: CANVAS_DROPPABLE_ID });

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") selectNode(null);
    if (event.key === "Delete" && selectedId) deleteWidget(selectedId);
  };

  return (
    <section aria-label="Canvas" className="flex h-full min-h-0 flex-col bg-surface">
      <PanelHeader title="Canvas" />
      <div
        ref={setNodeRef}
        role="presentation"
        onClick={() => selectNode(null)}
        onKeyDown={handleKeyDown}
        className="min-h-0 flex-1 overflow-auto p-4"
      >
        {config.widgets.length === 0 && <EmptyCanvas />}
        <SortableContext items={config.widgets} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            {config.widgets.map((widget) => (
              <SortableWidget key={widget.id} widget={widget} />
            ))}
          </div>
        </SortableContext>
      </div>
    </section>
  );
}
