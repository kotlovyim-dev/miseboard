import { describe, expect, it } from "vitest";
import { AppConfig, IdSchema, WidgetDef } from "./app-config";
import {
  chartWidget,
  formWidget,
  fullConfig,
  markReadyMutation,
  selectWidget,
  statWidget,
  tableWidget,
  textWidget,
} from "./fixtures";

describe("AppConfig", () => {
  it("accepts a full config with every widget type", () => {
    expect(AppConfig.safeParse(fullConfig).success).toBe(true);
  });

  it("rejects a version other than 1", () => {
    expect(AppConfig.safeParse({ ...fullConfig, version: 2 }).success).toBe(false);
  });

  it("rejects more than 30 queries", () => {
    const queries = Array.from({ length: 31 }, (_, index) => ({
      ...markReadyMutation,
      id: `query${index}`,
    }));

    expect(AppConfig.safeParse({ ...fullConfig, queries }).success).toBe(false);
  });

  it("applies defaults for variables, trigger and page size", () => {
    const parsed = AppConfig.parse({
      version: 1,
      queries: [{ id: "ordersQuery", kind: "query", document: "query { orders }" }],
      widgets: [
        {
          ...tableWidget,
          props: { data: "{{ ordersQuery.data }}", columns: [] },
        },
      ],
    });

    const [query] = parsed.queries;
    const [widget] = parsed.widgets;
    expect(query?.variables).toEqual({});
    expect(query?.trigger).toBe("onLoad");
    expect(widget?.type === "table" && widget.props.pageSize).toBe(10);
  });

  it.each([
    [40, true],
    [41, false],
  ])("with %i widgets the config validity is %s", (count, isValid) => {
    const widgets = Array.from({ length: count }, (_, index) => ({
      ...textWidget,
      id: `text${index}`,
    }));

    expect(AppConfig.safeParse({ ...fullConfig, widgets }).success).toBe(isValid);
  });
});

describe("WidgetDef", () => {
  it.each([tableWidget, statWidget, chartWidget, textWidget, selectWidget, formWidget])(
    "accepts a $type widget",
    (widget) => {
      expect(WidgetDef.safeParse(widget).success).toBe(true);
    },
  );

  it("keeps the options of a form select field", () => {
    const field = { name: "item", label: "Item", type: "select", options: "{{ items.data }}" };
    const parsed = WidgetDef.parse({
      ...formWidget,
      props: { ...formWidget.props, fields: [field] },
    });

    expect(parsed.type === "form" && parsed.props.fields[0]?.options).toBe("{{ items.data }}");
  });

  it("defaults the chart format to number", () => {
    const props = { data: chartWidget.props.data, xKey: "day", yKey: "total" };
    const parsed = WidgetDef.parse({ ...chartWidget, props });

    expect(parsed.type === "chart" && parsed.props.format).toBe("number");
  });

  it("rejects an unknown widget type", () => {
    expect(WidgetDef.safeParse({ ...textWidget, type: "gauge" }).success).toBe(false);
  });

  it.each([3, 4, 6, 12])("accepts a width of %i", (width) => {
    expect(WidgetDef.safeParse({ ...textWidget, width }).success).toBe(true);
  });

  it.each([1, 5, 8, 13])("rejects a width of %i", (width) => {
    expect(WidgetDef.safeParse({ ...textWidget, width }).success).toBe(false);
  });

  it.each([5, 100])("accepts a page size of %i", (pageSize) => {
    const props = { ...tableWidget.props, pageSize };

    expect(WidgetDef.safeParse({ ...tableWidget, props }).success).toBe(true);
  });

  it.each([4, 101])("rejects a page size of %i", (pageSize) => {
    const props = { ...tableWidget.props, pageSize };

    expect(WidgetDef.safeParse({ ...tableWidget, props }).success).toBe(false);
  });
});

describe("IdSchema", () => {
  it.each(["table1", "venueSelect", "orders_query", `a${"b".repeat(39)}`])("accepts %j", (id) => {
    expect(IdSchema.safeParse(id).success).toBe(true);
  });

  it.each(["1table", "Table", "my-table", "", "a".repeat(41)])("rejects %j", (id) => {
    expect(IdSchema.safeParse(id).success).toBe(false);
  });
});
