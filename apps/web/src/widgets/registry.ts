import type { WidgetType } from "@miseboard/config";
import { statDefinition } from "./stat/definition";
import { tableDefinition } from "./table/definition";
import type { WidgetDefinition } from "./types";

export type WidgetRegistry = Partial<Record<WidgetType, WidgetDefinition>>;

export const widgetRegistry: WidgetRegistry = {
  stat: statDefinition,
  table: tableDefinition,
};
