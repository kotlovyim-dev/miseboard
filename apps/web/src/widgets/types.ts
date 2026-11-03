import type { ComponentType } from "react";
import type { WidgetConfig, WidgetType } from "@miseboard/config";

export type WidgetProps = WidgetConfig["props"];
export type EvaluatedProps = Record<string, unknown>;
export type WidgetState = Record<string, unknown>;

interface FieldBase {
  name: string;
  label: string;
}

interface NumberField extends FieldBase {
  kind: "number";
  min: number;
  max: number;
}

interface SelectField extends FieldBase {
  kind: "select";
  options: readonly string[];
}

interface PlainField extends FieldBase {
  kind: "template" | "text" | "columns" | "fields" | "rowAction" | "mutation" | "variables";
}

export type InspectorField = PlainField | NumberField | SelectField;

export interface WidgetComponentProps {
  id: string;
  props: EvaluatedProps;
  state: WidgetState;
  setState: (state: WidgetState) => void;
}

export interface DefaultPropsContext {
  queryIds: string[];
}

export interface WidgetDefinition<TProps extends WidgetProps = WidgetProps> {
  type: WidgetType;
  label: string;
  defaultProps(id: string, context: DefaultPropsContext): TProps;
  templatedFields(props: TProps): Record<string, string>;
  initialState(props: TProps): WidgetState;
  inspectorFields: InspectorField[];
  Component: ComponentType<WidgetComponentProps>;
  Skeleton: ComponentType;
}
