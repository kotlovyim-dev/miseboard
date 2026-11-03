import type { ComponentType } from "react";
import { ExpressionField } from "./expression-field";
import type { FieldEditorProps, FieldKind, FieldOfKind } from "./field-editor-props";
import { NumberField } from "./number-field";
import { SelectField } from "./select-field";

type FieldEditors = {
  [TKind in FieldKind]?: ComponentType<FieldEditorProps<FieldOfKind<TKind>>>;
};

const fieldEditors: FieldEditors = {
  template: ExpressionField,
  number: NumberField,
  select: SelectField,
};

export function FieldEditor(props: FieldEditorProps) {
  const Editor = fieldEditors[props.field.kind] as ComponentType<FieldEditorProps> | undefined;
  return Editor ? <Editor {...props} /> : null;
}
