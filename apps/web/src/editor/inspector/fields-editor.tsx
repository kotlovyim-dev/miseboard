"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FormFieldConfig, FormFieldType } from "@/widgets/form/form-fields";
import type { FieldEditorProps, FieldOfKind } from "./field-editor-props";

const TYPES: FormFieldType[] = ["text", "number", "select"];

export function FieldsEditor({ field, value, onChange }: FieldEditorProps<FieldOfKind<"fields">>) {
  const fields: FormFieldConfig[] = Array.isArray(value) ? value : [];

  const changeField = (index: number, changes: Partial<FormFieldConfig>) =>
    onChange(
      fields.map((entry, position) => (position === index ? { ...entry, ...changes } : entry)),
    );

  const removeField = (index: number) =>
    onChange(fields.filter((_, position) => position !== index));

  const addField = () =>
    onChange([...fields, { name: `field${fields.length + 1}`, label: "", type: "text" }]);

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{field.label}</legend>
      {fields.length === 0 && (
        <p className="text-xs text-muted-foreground">No fields yet. Add one to build the form.</p>
      )}
      {fields.map((entry, index) => (
        <div key={index} className="space-y-1.5 rounded-md border border-border p-2">
          <div className="flex items-center gap-1.5">
            <Input
              aria-label={`Field ${index + 1} name`}
              placeholder="name"
              value={entry.name}
              onChange={(event) => changeField(index, { name: event.target.value })}
              spellCheck={false}
              className="font-mono"
            />
            <Input
              aria-label={`Field ${index + 1} label`}
              placeholder="Label"
              value={entry.label}
              onChange={(event) => changeField(index, { label: event.target.value })}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove field ${index + 1}`}
              onClick={() => removeField(index)}
            >
              <X aria-hidden strokeWidth={1.5} />
            </Button>
          </div>
          <select
            aria-label={`Field ${index + 1} type`}
            value={entry.type}
            onChange={(event) => changeField(index, { type: event.target.value as FormFieldType })}
            className="h-8 w-full rounded-md border border-input bg-card px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <Input
            aria-label={`Field ${index + 1} default`}
            placeholder="Default, like {{ 1 }}"
            value={entry.default ?? ""}
            onChange={(event) => changeField(index, { default: event.target.value || undefined })}
            spellCheck={false}
            className="font-mono"
          />
          {entry.type === "select" && (
            <Input
              aria-label={`Field ${index + 1} options`}
              placeholder="Options, like {{ inventoryQuery.data }}"
              value={entry.options ?? ""}
              onChange={(event) => changeField(index, { options: event.target.value || undefined })}
              spellCheck={false}
              className="font-mono"
            />
          )}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addField}>
        <Plus aria-hidden strokeWidth={1.5} />
        Add field
      </Button>
    </fieldset>
  );
}
