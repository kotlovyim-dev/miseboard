"use client";

import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import type { FieldEditorProps, FieldOfKind } from "./field-editor-props";

export function NumberField({ field, value, onChange }: FieldEditorProps<FieldOfKind<"number">>) {
  const inputId = useId();
  const [draft, setDraft] = useState(String(value));

  const handleChange = (text: string) => {
    setDraft(text);
    const parsed = Number(text);
    if (Number.isInteger(parsed) && parsed >= field.min && parsed <= field.max) onChange(parsed);
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-sm font-medium">
        {field.label}
      </label>
      <Input
        id={inputId}
        type="number"
        min={field.min}
        max={field.max}
        value={draft}
        onChange={(event) => handleChange(event.target.value)}
        onBlur={() => setDraft(String(value))}
        className="tabular-nums"
      />
    </div>
  );
}
