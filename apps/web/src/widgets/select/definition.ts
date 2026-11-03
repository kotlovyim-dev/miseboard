import type { WidgetConfig } from "@miseboard/config";
import type { WidgetDefinition } from "../types";
import { SelectSkeleton } from "./select-skeleton";
import { SelectWidget } from "./select-widget";

type SelectProps = Extract<WidgetConfig, { type: "select" }>["props"];

export const selectDefinition: WidgetDefinition<SelectProps> = {
  type: "select",
  label: "Select",
  defaultProps: (_id, { queryIds }) => ({
    options: queryIds[0] ? `{{ ${queryIds[0]}.data }}` : "{{ [] }}",
    labelKey: "name",
    valueKey: "id",
  }),
  templatedFields: ({ options, default: defaultValue }) => ({
    options,
    ...(defaultValue === undefined ? {} : { default: defaultValue }),
  }),
  initialState: () => ({ value: null }),
  inspectorFields: [
    { kind: "template", name: "options", label: "Options" },
    { kind: "text", name: "labelKey", label: "Label key" },
    { kind: "text", name: "valueKey", label: "Value key" },
    { kind: "template", name: "default", label: "Default" },
  ],
  Component: SelectWidget,
  Skeleton: SelectSkeleton,
};
