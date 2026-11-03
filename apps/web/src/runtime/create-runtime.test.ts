import { describe, expect, it } from "vitest";
import { AppConfig } from "@miseboard/config";
import { buildEngine, createRuntime, syncRuntime } from "./create-runtime";
import { sampleConfig, tableDefinition } from "./fixtures";

const registry = { table: tableDefinition };

describe("syncRuntime", () => {
  it("keeps widget state and query results across a config edit", () => {
    const { store } = createRuntime(sampleConfig, "ADMIN", registry);
    store.getState().setWidgetState("ordersTable", { selectedRow: { id: "o1" } });
    store
      .getState()
      .setQueryState("ordersQuery", { data: [{ id: "o1" }], isLoading: false, error: null });
    const edited = AppConfig.parse({
      ...sampleConfig,
      widgets: sampleConfig.widgets.map((widget) =>
        widget.id === "notes" ? { ...widget, props: { content: "Edited" } } : widget,
      ),
    });

    syncRuntime(store, buildEngine(edited, registry), edited, "ADMIN", registry);

    expect(store.getState().widgetStates["ordersTable"]).toEqual({ selectedRow: { id: "o1" } });
    expect(store.getState().queryStates["ordersQuery"]?.data).toEqual([{ id: "o1" }]);
  });

  it("adds state for new nodes and drops state for removed ones", () => {
    const { store } = createRuntime(sampleConfig, "ADMIN", registry);
    const edited = AppConfig.parse({
      ...sampleConfig,
      queries: [],
      widgets: sampleConfig.widgets.filter((widget) => widget.id !== "notes"),
    });

    syncRuntime(store, buildEngine(edited, registry), edited, "ADMIN", registry);

    expect(Object.keys(store.getState().queryStates)).toEqual([]);
    expect(Object.keys(store.getState().widgetStates)).not.toContain("notes");
  });
});
