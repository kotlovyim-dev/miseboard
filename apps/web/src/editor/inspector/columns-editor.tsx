"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TableColumn } from "@/widgets/table/table-columns";
import type { FieldEditorProps, FieldOfKind } from "./field-editor-props";

export function ColumnsEditor({
  field,
  value,
  onChange,
}: FieldEditorProps<FieldOfKind<"columns">>) {
  const columns: TableColumn[] = Array.isArray(value) ? value : [];

  const changeColumn = (index: number, changes: Partial<TableColumn>) =>
    onChange(
      columns.map((column, position) => (position === index ? { ...column, ...changes } : column)),
    );

  const removeColumn = (index: number) =>
    onChange(columns.filter((_, position) => position !== index));

  const addColumn = () => onChange([...columns, { key: "", label: "" }]);

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{field.label}</legend>
      {columns.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No columns yet. Add one to choose what the table shows.
        </p>
      )}
      {columns.map((column, index) => (
        <div key={index} className="space-y-1.5 rounded-md border border-border p-2">
          <div className="flex items-center gap-1.5">
            <Input
              aria-label={`Column ${index + 1} key`}
              placeholder="key"
              value={column.key}
              onChange={(event) => changeColumn(index, { key: event.target.value })}
              spellCheck={false}
              className="font-mono"
            />
            <Input
              aria-label={`Column ${index + 1} label`}
              placeholder="Label"
              value={column.label}
              onChange={(event) => changeColumn(index, { label: event.target.value })}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove column ${index + 1}`}
              onClick={() => removeColumn(index)}
            >
              <X aria-hidden strokeWidth={1.5} />
            </Button>
          </div>
          <Input
            aria-label={`Column ${index + 1} cell`}
            placeholder="{{ row.total }}"
            value={column.cell ?? ""}
            onChange={(event) => changeColumn(index, { cell: event.target.value || undefined })}
            spellCheck={false}
            className="font-mono"
          />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addColumn}>
        <Plus aria-hidden strokeWidth={1.5} />
        Add column
      </Button>
    </fieldset>
  );
}
