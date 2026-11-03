"use client";

import { useId } from "react";
import type { FieldEditorProps, FieldOfKind } from "./field-editor-props";

export function SelectField({ field, value, onChange }: FieldEditorProps<FieldOfKind<"select">>) {
  const selectId = useId();

  return (
    <div className="space-y-1.5">
      <label htmlFor={selectId} className="text-sm font-medium">
        {field.label}
      </label>
      <select
        id={selectId}
        value={String(value)}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 w-full rounded-md border border-input bg-card px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {field.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
