import type { WidgetConfig } from "@miseboard/config";
import type { WidgetDefinition } from "../types";
import { FormSkeleton } from "./form-skeleton";
import { FormWidget } from "./form-widget";

type FormProps = Extract<WidgetConfig, { type: "form" }>["props"];

type FormField = FormProps["fields"][number];

export const formDefinition: WidgetDefinition<FormProps> = {
  type: "form",
  label: "Form",
  defaultProps: () => ({ fields: [], submitLabel: "Submit", mutation: "", variables: {} }),
  templatedFields: ({ fields }) => Object.fromEntries(fields.flatMap(toFieldTemplates)),
  initialState: () => ({ values: {}, isSubmitting: false }),
  inspectorFields: [
    { kind: "fields", name: "fields", label: "Fields" },
    { kind: "text", name: "submitLabel", label: "Submit label" },
    { kind: "mutation", name: "mutation", label: "Mutation" },
    { kind: "variables", name: "variables", label: "Variables" },
  ],
  Component: FormWidget,
  Skeleton: FormSkeleton,
};

function toFieldTemplates({ name, default: defaultValue, options }: FormField) {
  const templates = { default: defaultValue, options };
  return Object.entries(templates).flatMap(([key, source]): [string, string][] =>
    source === undefined ? [] : [[`fields.${name}.${key}`, source]],
  );
}
