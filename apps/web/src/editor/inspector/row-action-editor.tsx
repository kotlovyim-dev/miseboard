"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { readRowAction } from "@/widgets/table/table-columns";
import type { TableRowAction } from "@/widgets/table/table-columns";
import type { FieldEditorProps, FieldOfKind } from "./field-editor-props";
import { MutationField } from "./mutation-field";
import { VariableInputs } from "./variable-inputs";

const NEW_ROW_ACTION: TableRowAction = { label: "Action", mutation: "", variables: {} };

export function RowActionEditor({
  field,
  widgetId,
  value,
  onChange,
}: FieldEditorProps<FieldOfKind<"rowAction">>) {
  const action = readRowAction({ rowAction: value });

  if (!action) {
    return (
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">{field.label}</legend>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange(NEW_ROW_ACTION)}>
          <Plus aria-hidden strokeWidth={1.5} />
          Add row action
        </Button>
      </fieldset>
    );
  }

  const change = (changes: Partial<TableRowAction>) => onChange({ ...action, ...changes });

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{field.label}</legend>
      <div className="space-y-2 rounded-md border border-border p-2">
        <div className="flex items-center gap-1.5">
          <Input
            aria-label="Row action label"
            placeholder="Label"
            value={action.label}
            onChange={(event) => change({ label: event.target.value })}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Remove row action"
            onClick={() => onChange(undefined)}
          >
            <X aria-hidden strokeWidth={1.5} />
          </Button>
        </div>
        <MutationField
          field={{ kind: "mutation", name: "mutation", label: "Mutation" }}
          widgetId={widgetId}
          value={action.mutation}
          onChange={(mutation) => change({ mutation: String(mutation) })}
        />
        <VariableInputs
          mutationId={action.mutation}
          variables={action.variables}
          placeholder="{{ row.id }}"
          onChange={(variables) => change({ variables })}
        />
      </div>
    </fieldset>
  );
}
