"use client";

import { Play, Trash2 } from "lucide-react";
import type { QueryConfig } from "@miseboard/config";
import { Button } from "@/components/ui/button";
import { NodeIdField } from "@/editor/inspector/node-id-field";
import { useEditorStore } from "@/editor/store/editor-store";
import { KindBadge } from "./kind-badge";
import { useDeleteQuery } from "./use-delete-query";

const REASON_ID = "run-blocked-reason";

const TRIGGERS: { value: QueryConfig["trigger"]; label: string }[] = [
  { value: "onLoad", label: "On load" },
  { value: "manual", label: "Manual" },
];

interface QueryHeaderProps {
  query: QueryConfig;
  isRunning: boolean;
  blockedReason: string | null;
  onRun: () => void;
}

export function QueryHeader({ query, isRunning, blockedReason, onRun }: QueryHeaderProps) {
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
      {blockedReason && (
        <span id={REASON_ID} className="ml-auto text-xs text-muted-foreground">
          {blockedReason}
        </span>
      )}
      <Button
        type="button"
        size="sm"
        className={blockedReason ? undefined : "ml-auto"}
        disabled={blockedReason !== null || isRunning}
        aria-describedby={blockedReason ? REASON_ID : undefined}
        onClick={onRun}
      >
        <Play aria-hidden strokeWidth={1.5} />
        {isRunning ? "Running" : "Run query"}
        <kbd className="font-sans text-xs opacity-80">⌘↵</kbd>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Delete ${query.id}`}
        onClick={() => deleteQuery(query)}
      >
        <Trash2 aria-hidden strokeWidth={1.5} />
      </Button>
    </div>
  );
}
