import { beforeEach, describe, expect, it } from "vitest";
import { AppConfig, EMPTY_APP_CONFIG, type WidgetType } from "@miseboard/config";
import { demoApp } from "@/runtime/demo-app";
import { useEditorStore } from "./editor-store";
import { nextId } from "./next-id";
import { validateNodeId } from "./validate-node-id";

const store = useEditorStore;
const widgetIds = () => store.getState().config.widgets.map((widget) => widget.id);

beforeEach(() => store.setState(store.getInitialState(), true));

describe("nextId", () => {
  it("skips ids taken by widgets and queries", () => {
    const config = AppConfig.parse({
      version: 1,
      queries: [{ id: "node1", kind: "query", document: "" }],
      widgets: [{ id: "node2", type: "text", width: 4, props: { content: "" } }],
    });

    expect(nextId(config, "node")).toBe("node3");
    expect(nextId(EMPTY_APP_CONFIG, "table")).toBe("table1");
  });
});

describe("widget actions", () => {
  it("adds widgets with unique ids and selects the new one", () => {
    store.getState().addWidget("table");
    store.getState().addWidget("table");

    expect(widgetIds()).toEqual(["table1", "table2"]);
    expect(store.getState().selectedId).toBe("table2");
  });

  it("inserts at an index", () => {
    store.getState().addWidget("text");
    store.getState().addWidget("stat", 0);

    expect(widgetIds()).toEqual(["stat1", "text1"]);
  });

  it("binds a new table to the first query", () => {
    store.getState().setConfig(demoApp.config);
    store.getState().addWidget("table");

    const added = store.getState().config.widgets.at(-1);
    expect(added?.type === "table" && added.props.data).toBe("{{ ordersQuery.data }}");
  });

  it("ignores widget types without a definition", () => {
    store.getState().addWidget("select");

    expect(widgetIds()).toEqual([]);
  });

  it("removes a widget and clears its selection", () => {
    store.getState().addWidget("text");
    store.getState().removeWidget("text1");

    expect(widgetIds()).toEqual([]);
    expect(store.getState().selectedId).toBeNull();
  });

  it("moves a widget", () => {
    const types: WidgetType[] = ["text", "stat", "table"];
    types.forEach((type) => store.getState().addWidget(type));
    store.getState().moveWidget(0, 2);

    expect(widgetIds()).toEqual(["stat1", "table1", "text1"]);
  });

  it("merges widget props and sets the width", () => {
    store.getState().addWidget("text");
    store.getState().updateWidgetProps("text1", { content: "hello" });
    store.getState().setWidgetWidth("text1", 12);

    const [widget] = store.getState().config.widgets;
    expect(widget?.type === "text" && widget.props.content).toBe("hello");
    expect(widget?.width).toBe(12);
  });
});

describe("renameNode", () => {
  it("renames a widget and follows the selection", () => {
    store.getState().addWidget("text");
    store.getState().renameNode("text1", "intro");

    expect(widgetIds()).toEqual(["intro"]);
    expect(store.getState().selectedId).toBe("intro");
  });

  it("renames a query and follows the active query", () => {
    store.getState().addQuery();
    store.getState().renameNode("query1", "ordersQuery");

    expect(store.getState().config.queries[0]?.id).toBe("ordersQuery");
    expect(store.getState().activeQueryId).toBe("ordersQuery");
  });

  it.each(["Bad-id", "text2"])("rejects %j", (newId) => {
    store.getState().addWidget("text");
    store.getState().addWidget("text");
    store.getState().renameNode("text1", newId);

    expect(widgetIds()).toEqual(["text1", "text2"]);
  });
});

describe("validateNodeId", () => {
  const config = AppConfig.parse({
    version: 1,
    queries: [{ id: "ordersQuery", kind: "query", document: "" }],
    widgets: [{ id: "intro", type: "text", width: 4, props: { content: "" } }],
  });

  it("accepts a free id and the current id", () => {
    expect(validateNodeId(config, "intro", "summary")).toBeNull();
    expect(validateNodeId(config, "intro", "intro")).toBeNull();
  });

  it("rejects a malformed id", () => {
    expect(validateNodeId(config, "intro", "Bad-id")).toMatch(/lowercase letter/);
  });

  it("names an id that another node uses", () => {
    expect(validateNodeId(config, "intro", "ordersQuery")).toBe("ordersQuery is already used.");
  });
});

describe("query actions", () => {
  it("adds, updates and removes a query", () => {
    store.getState().addQuery();
    store.getState().addQuery();
    store.getState().updateQuery("query2", { document: "query { orders }", trigger: "manual" });

    expect(store.getState().config.queries[1]).toMatchObject({ id: "query2", trigger: "manual" });
    expect(store.getState().activeQueryId).toBe("query2");

    store.getState().removeQuery("query2");

    expect(store.getState().config.queries.map((query) => query.id)).toEqual(["query1"]);
    expect(store.getState().activeQueryId).toBeNull();
  });
});

describe("selection and ui", () => {
  it("tracks selection, hovered reference and mode", () => {
    store.getState().selectNode("table1");
    store.getState().setHoveredReference("ordersQuery");
    store.getState().setMode("preview");

    expect(store.getState()).toMatchObject({
      selectedId: "table1",
      hoveredReference: "ordersQuery",
      mode: "preview",
    });
  });
});
