"use client";

import { Plus } from "lucide-react";
import { IdChip } from "@/components/id-chip";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/editor/store/editor-store";
import { cn } from "@/lib/utils";
import { KindBadge } from "./kind-badge";

export function QueryList() {
  const queries = useEditorStore((state) => state.config.queries);
  const activeQueryId = useEditorStore((state) => state.activeQueryId);
  const setActiveQueryId = useEditorStore((state) => state.setActiveQueryId);
  const addQuery = useEditorStore((state) => state.addQuery);

  return (
    <div className="flex w-52 shrink-0 flex-col border-r border-border">
      <ul className="min-h-0 flex-1 overflow-auto p-1.5">
        {queries.map((query) => (
          <li key={query.id}>
            <button
              type="button"
              aria-current={query.id === activeQueryId}
              onClick={() => setActiveQueryId(query.id)}
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
                query.id === activeQueryId && "bg-accent",
              )}
            >
              <IdChip id={query.id} />
              <KindBadge kind={query.kind} />
            </button>
          </li>
        ))}
        {queries.length === 0 && (
          <li className="p-2 text-sm text-muted-foreground">No queries yet.</li>
        )}
      </ul>
      <div className="border-t border-border p-1.5">
        <Button type="button" variant="ghost" size="sm" className="w-full" onClick={addQuery}>
          <Plus aria-hidden strokeWidth={1.5} />
          New query
        </Button>
      </div>
    </div>
  );
}
