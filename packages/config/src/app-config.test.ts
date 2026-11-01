import { describe, expect, it } from "vitest";
import { AppConfig, IdSchema, WidgetDef } from "./app-config";
import {
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
});

describe("WidgetDef", () => {
  it.each([tableWidget, statWidget, textWidget, selectWidget, formWidget])(
    "accepts a $type widget",
    (widget) => {
      expect(WidgetDef.safeParse(widget).success).toBe(true);
    },
  );

  it("rejects an unknown widget type", () => {
    expect(WidgetDef.safeParse({ ...textWidget, type: "chart" }).success).toBe(false);
  });

  it.each([3, 4, 6, 12])("accepts a width of %i", (width) => {
    expect(WidgetDef.safeParse({ ...textWidget, width }).success).toBe(true);
  });

  it.each([1, 5, 8, 13])("rejects a width of %i", (width) => {
    expect(WidgetDef.safeParse({ ...textWidget, width }).success).toBe(false);
  });

  it("rejects a page size outside 5 to 100", () => {
    const props = { ...tableWidget.props, pageSize: 4 };

    expect(WidgetDef.safeParse({ ...tableWidget, props }).success).toBe(false);
  });
});

describe("IdSchema", () => {
  it.each(["table1", "venueSelect", "orders_query"])("accepts %s", (id) => {
    expect(IdSchema.safeParse(id).success).toBe(true);
  });

  it.each(["1table", "Table", "my-table", "", "a".repeat(41)])("rejects %j", (id) => {
    expect(IdSchema.safeParse(id).success).toBe(false);
  });
});
