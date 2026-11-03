import type { WidgetType } from "@miseboard/config";
import { formDefinition } from "./form/definition";
import { selectDefinition } from "./select/definition";
import { statDefinition } from "./stat/definition";
import { tableDefinition } from "./table/definition";
import { textDefinition } from "./text/definition";
import type { WidgetDefinition } from "./types";

export type WidgetRegistry = Partial<Record<WidgetType, WidgetDefinition>>;

export const widgetRegistry: WidgetRegistry = {
  form: formDefinition,
  select: selectDefinition,
  stat: statDefinition,
  table: tableDefinition,
  text: textDefinition,
};
