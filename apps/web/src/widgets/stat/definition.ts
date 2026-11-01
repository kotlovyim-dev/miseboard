import type { WidgetConfig } from "@miseboard/config";
import type { WidgetDefinition } from "../types";
import { StatSkeleton } from "./stat-skeleton";
import { StatWidget } from "./stat-widget";

type StatProps = Extract<WidgetConfig, { type: "stat" }>["props"];

export const statDefinition: WidgetDefinition<StatProps> = {
  type: "stat",
  label: "Stat",
  defaultProps: (id) => ({ label: id, value: "{{ 0 }}", format: "number" }),
  templatedFields: ({ label, value, trend }) => ({
    label,
    value,
    ...(trend === undefined ? {} : { trend }),
  }),
  initialState: () => ({}),
  inspectorFields: [
    { kind: "template", name: "label", label: "Label" },
    { kind: "template", name: "value", label: "Value" },
    { kind: "select", name: "format", label: "Format", options: ["number", "uah", "percent"] },
    { kind: "template", name: "trend", label: "Trend" },
  ],
  Component: StatWidget,
  Skeleton: StatSkeleton,
};
