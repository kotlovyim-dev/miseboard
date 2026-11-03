"use client";

import { useState } from "react";
import { IdChip } from "@/components/id-chip";
import { Input } from "@/components/ui/input";
import { useEditorStore } from "@/editor/store/editor-store";
import { validateNodeId } from "@/editor/store/validate-node-id";

export function NodeIdField({ id }: { id: string }) {
  const config = useEditorStore((state) => state.config);
  const renameNode = useEditorStore((state) => state.renameNode);
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopEditing = () => {
    setDraft(null);
    setError(null);
  };

  const commit = () => {
    if (draft === null) return;
    const problem = validateNodeId(config, id, draft);
    if (problem) return setError(problem);
    renameNode(id, draft);
    stopEditing();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") commit();
    if (event.key === "Escape") stopEditing();
  };

  if (draft === null) {
    return (
      <button
        type="button"
        aria-label={`Rename ${id}`}
        onClick={() => setDraft(id)}
        className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <IdChip id={id} className="cursor-text hover:bg-accent" />
      </button>
    );
  }

  return (
    <div className="min-w-0 flex-1 space-y-1">
      <Input
        autoFocus
        aria-label="Widget id"
        aria-invalid={error !== null}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        className="h-7 font-mono text-xs"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
