import { z } from "zod";

export const IdSchema = z
  .string()
  .regex(/^[a-z][A-Za-z0-9_]*$/)
  .max(40);

const Template = z.string().max(2000);

export const QueryDef = z.object({
  id: IdSchema,
  kind: z.enum(["query", "mutation"]),
  document: z.string().max(5000),
  variables: z.record(z.string(), Template).default({}),
  trigger: z.enum(["onLoad", "manual"]).default("onLoad"),
});

const WidgetBase = {
  id: IdSchema,
  width: z.union([z.literal(3), z.literal(4), z.literal(6), z.literal(12)]),
};

const TableColumn = z.object({
  key: z.string(),
  label: z.string(),
  cell: Template.optional(),
});

const RowAction = z.object({
  label: z.string(),
  mutation: IdSchema,
  variables: z.record(z.string(), Template),
});

const FormField = z.object({
  name: IdSchema,
  label: z.string(),
  type: z.enum(["text", "number", "select"]),
  default: Template.optional(),
  options: Template.optional(),
});

const TableWidget = z.object({
  ...WidgetBase,
  type: z.literal("table"),
  props: z.object({
    data: Template,
    pageSize: z.number().int().min(5).max(100).default(10),
    columns: z.array(TableColumn),
    rowAction: RowAction.optional(),
  }),
});

const StatWidget = z.object({
  ...WidgetBase,
  type: z.literal("stat"),
  props: z.object({
    label: Template,
    value: Template,
    format: z.enum(["number", "uah", "percent"]),
    trend: Template.optional(),
  }),
});

const ChartWidget = z.object({
  ...WidgetBase,
  type: z.literal("chart"),
  props: z.object({
    data: Template,
    xKey: z.string(),
    yKey: z.string(),
    format: z.enum(["number", "uah", "percent"]).default("number"),
  }),
});

const TextWidget = z.object({
  ...WidgetBase,
  type: z.literal("text"),
  props: z.object({ content: Template }),
});

const SelectWidget = z.object({
  ...WidgetBase,
  type: z.literal("select"),
  props: z.object({
    options: Template,
    labelKey: z.string(),
    valueKey: z.string(),
    default: Template.optional(),
  }),
});

const FormWidget = z.object({
  ...WidgetBase,
  type: z.literal("form"),
  props: z.object({
    fields: z.array(FormField),
    submitLabel: z.string(),
    mutation: IdSchema,
    variables: z.record(z.string(), Template),
  }),
});

export const WidgetDef = z.discriminatedUnion("type", [
  TableWidget,
  StatWidget,
  ChartWidget,
  TextWidget,
  SelectWidget,
  FormWidget,
]);

export const AppConfig = z.object({
  version: z.literal(1),
  queries: z.array(QueryDef).max(30),
  widgets: z.array(WidgetDef).max(40),
});

export type AppConfigData = z.infer<typeof AppConfig>;
export type WidgetConfig = z.infer<typeof WidgetDef>;
export type QueryConfig = z.infer<typeof QueryDef>;
export type WidgetType = WidgetConfig["type"];
export type WidgetWidth = WidgetConfig["width"];
