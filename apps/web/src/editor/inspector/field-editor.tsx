import type { ComponentType } from "react";
import { ColumnsEditor } from "./columns-editor";
import { ExpressionField } from "./expression-field";
import { FieldsEditor } from "./fields-editor";
import type { FieldEditorProps, FieldKind, FieldOfKind } from "./field-editor-props";
import { MutationField } from "./mutation-field";
import { NumberField } from "./number-field";
import { RowActionEditor } from "./row-action-editor";
import { SelectField } from "./select-field";
import { TextField } from "./text-field";
import { VariablesField } from "./variables-field";

type FieldEditors = {
  [TKind in FieldKind]?: ComponentType<FieldEditorProps<FieldOfKind<TKind>>>;
};

const fieldEditors: FieldEditors = {
  template: ExpressionField,
  columns: ColumnsEditor,
  fields: FieldsEditor,
  mutation: MutationField,
  rowAction: RowActionEditor,
  variables: VariablesField,
  number: NumberField,
  select: SelectField,
  text: TextField,
};

export function FieldEditor(props: FieldEditorProps) {
  const Editor = fieldEditors[props.field.kind] as ComponentType<FieldEditorProps> | undefined;
  return Editor ? <Editor {...props} /> : null;
}
