import type { WidgetConfig } from "@miseboard/config";
import type { WidgetDefinition } from "../types";
import { ChartSkeleton } from "./chart-skeleton";
import { ChartWidget } from "./chart-widget";

type ChartProps = Extract<WidgetConfig, { type: "chart" }>["props"];

export const chartDefinition: WidgetDefinition<ChartProps> = {
  type: "chart",
  label: "Chart",
  defaultProps: (_id, { queryIds }) => ({
    data: queryIds[0] ? `{{ ${queryIds[0]}.data }}` : "{{ [] }}",
    xKey: "day",
    yKey: "total",
    format: "number",
  }),
  templatedFields: ({ data }) => ({ data }),
  initialState: () => ({}),
  inspectorFields: [
    { kind: "template", name: "data", label: "Data" },
    { kind: "text", name: "xKey", label: "Label key" },
    { kind: "text", name: "yKey", label: "Value key" },
    { kind: "select", name: "format", label: "Format", options: ["number", "uah", "percent"] },
  ],
  Component: ChartWidget,
  Skeleton: ChartSkeleton,
};
