"use client";

import { PanelHeader } from "@/editor/layout/panel-header";
import { useEditorStore } from "@/editor/store/editor-store";
import { QueryHeader } from "./query-header";
import { QueryList } from "./query-list";

export function QueryPanel() {
  const activeQuery = useEditorStore((state) =>
    state.config.queries.find(({ id }) => id === state.activeQueryId),
  );

  return (
    <section aria-label="Queries" className="flex h-full min-h-0 flex-col overflow-hidden">
      <PanelHeader title="Queries" />
      <div className="flex min-h-0 flex-1">
        <QueryList />
        <div className="min-w-0 flex-1 space-y-3 overflow-auto p-3">
          {activeQuery ? (
            <QueryHeader key={activeQuery.id} query={activeQuery} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Select a query to edit it, or add a new one.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
