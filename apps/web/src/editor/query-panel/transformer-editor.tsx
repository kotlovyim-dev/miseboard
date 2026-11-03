"use client";

import type { QueryConfig } from "@miseboard/config";
import { useEditorStore } from "@/editor/store/editor-store";

export function TransformerEditor({ query }: { query: QueryConfig }) {
  const updateQuery = useEditorStore((state) => state.updateQuery);
  const fieldId = `${query.id}-transformer`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={fieldId}
        className="text-xs font-medium tracking-[0.06em] text-muted-foreground uppercase"
      >
        Transformer
      </label>
      <textarea
        id={fieldId}
        value={query.transformer ?? ""}
        rows={4}
        spellCheck={false}
        placeholder="return data.orders.edges"
        onChange={(event) =>
          updateQuery(query.id, { transformer: event.target.value || undefined })
        }
        className="w-full rounded-md border border-input bg-card p-2 font-mono text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <p className="text-xs text-muted-foreground">
        Runs in a worker with a 1 s limit. Receives data and returns what {query.id}.data exposes.
      </p>
    </div>
  );
}
