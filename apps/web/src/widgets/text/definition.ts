import type { WidgetConfig } from "@miseboard/config";
import type { WidgetDefinition } from "../types";
import { TextSkeleton } from "./text-skeleton";
import { TextWidget } from "./text-widget";

type TextProps = Extract<WidgetConfig, { type: "text" }>["props"];

export const textDefinition: WidgetDefinition<TextProps> = {
  type: "text",
  label: "Text",
  defaultProps: () => ({ content: "Write **Markdown** here." }),
  templatedFields: ({ content }) => ({ content }),
  initialState: () => ({}),
  inspectorFields: [{ kind: "template", name: "content", label: "Content" }],
  Component: TextWidget,
  Skeleton: TextSkeleton,
};
