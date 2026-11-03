import type { InspectorField } from "@/widgets/types";

export interface FieldEditorProps<TField extends InspectorField = InspectorField> {
  field: TField;
  widgetId: string;
  value: unknown;
  onChange: (value: unknown) => void;
}

export type FieldKind = InspectorField["kind"];
export type FieldOfKind<TKind extends FieldKind> = InspectorField & { kind: TKind };
