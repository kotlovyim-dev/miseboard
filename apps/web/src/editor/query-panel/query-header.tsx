"use client";

import { Trash2 } from "lucide-react";
import type { QueryConfig } from "@miseboard/config";
import { Button } from "@/components/ui/button";
import { NodeIdField } from "@/editor/inspector/node-id-field";
import { useEditorStore } from "@/editor/store/editor-store";
import { KindBadge } from "./kind-badge";
import { useDeleteQuery } from "./use-delete-query";

const TRIGGERS: { value: QueryConfig["trigger"]; label: string }[] = [
  { value: "onLoad", label: "On load" },
  { value: "manual", label: "Manual" },
];

export function QueryHeader({ query }: { query: QueryConfig }) {
  const updateQuery = useEditorStore((state) => state.updateQuery);
  const deleteQuery = useDeleteQuery();

  return (
    <div className="flex items-center gap-2">
      <NodeIdField id={query.id} />
      <KindBadge kind={query.kind} />
      <select
        aria-label="Trigger"
        value={query.trigger}
        onChange={(event) =>
          updateQuery(query.id, { trigger: event.target.value as QueryConfig["trigger"] })
        }
        className="h-8 rounded-md border border-input bg-card px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {TRIGGERS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="ml-auto"
        aria-label={`Delete ${query.id}`}
        onClick={() => deleteQuery(query)}
      >
        <Trash2 aria-hidden strokeWidth={1.5} />
      </Button>
    </div>
  );
}
