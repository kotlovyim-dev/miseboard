"use client";

import { toast } from "sonner";
import type { QueryConfig } from "@miseboard/config";
import { useEditorStore } from "@/editor/store/editor-store";

const UNDO_TOAST_MS = 5000;

export function useDeleteQuery() {
  const removeQuery = useEditorStore((state) => state.removeQuery);
  const restoreQuery = useEditorStore((state) => state.restoreQuery);

  return (query: QueryConfig) => {
    const index = useEditorStore.getState().config.queries.findIndex(({ id }) => id === query.id);
    removeQuery(query.id);
    toast(`Deleted ${query.id}`, {
      duration: UNDO_TOAST_MS,
      action: { label: "Undo", onClick: () => restoreQuery(query, index) },
    });
  };
}
