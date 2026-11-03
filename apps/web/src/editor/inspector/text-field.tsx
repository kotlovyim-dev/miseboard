"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import type { FieldEditorProps, FieldOfKind } from "./field-editor-props";

export function TextField({ field, value, onChange }: FieldEditorProps<FieldOfKind<"text">>) {
  const inputId = useId();

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-sm font-medium">
        {field.label}
      </label>
      <Input
        id={inputId}
        value={String(value ?? "")}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
      />
    </div>
  );
}
