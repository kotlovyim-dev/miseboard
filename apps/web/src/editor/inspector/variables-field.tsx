"use client";

import { useEditorStore } from "@/editor/store/editor-store";
import { readVariableTemplates } from "@/mutations/read-variable-templates";
import type { FieldEditorProps, FieldOfKind } from "./field-editor-props";
import { VariableInputs } from "./variable-inputs";

export function VariablesField({
  field,
  widgetId,
  value,
  onChange,
}: FieldEditorProps<FieldOfKind<"variables">>) {
  const mutationId = useEditorStore((state) => {
    const props: Record<string, unknown> | undefined = state.config.widgets.find(
      (widget) => widget.id === widgetId,
    )?.props;
    return String(props?.mutation ?? "");
  });

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{field.label}</legend>
      <VariableInputs
        mutationId={mutationId}
        variables={readVariableTemplates(value)}
        placeholder="{{ values.amount }}"
        onChange={onChange}
      />
    </fieldset>
  );
}
