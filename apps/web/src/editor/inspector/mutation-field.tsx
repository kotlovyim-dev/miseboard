"use client";

import { useId } from "react";
import { useShallow } from "zustand/react/shallow";
import { useEditorStore } from "@/editor/store/editor-store";
import type { FieldEditorProps, FieldOfKind } from "./field-editor-props";

export function MutationField({
  field,
  value,
  onChange,
}: FieldEditorProps<FieldOfKind<"mutation">>) {
  const selectId = useId();
  const mutationIds = useEditorStore(
    useShallow((state) =>
      state.config.queries.filter((query) => query.kind === "mutation").map(({ id }) => id),
    ),
  );

  return (
    <div className="space-y-1.5">
      <label htmlFor={selectId} className="text-sm font-medium">
        {field.label}
      </label>
      <select
        id={selectId}
        value={String(value ?? "")}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 w-full rounded-md border border-input bg-card px-2 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="">Choose a mutation</option>
        {mutationIds.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>
      {mutationIds.length === 0 && (
        <p className="text-xs text-muted-foreground">
          Add a query of kind mutation in the query panel first.
        </p>
      )}
    </div>
  );
}
