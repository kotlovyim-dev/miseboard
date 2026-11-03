"use client";

import { useEditorStore } from "@/editor/store/editor-store";
import { useRuntime } from "@/runtime/runtime-context";

export function useDeleteWidget() {
  const { engine } = useRuntime();
  const removeWidget = useEditorStore((state) => state.removeWidget);
  const setPendingDeleteId = useEditorStore((state) => state.setPendingDeleteId);

  return (id: string) => {
    if (engine.referencesTo(id).length === 0) removeWidget(id);
    else setPendingDeleteId(id);
  };
}
