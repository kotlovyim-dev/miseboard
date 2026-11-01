import { describe, expect, it } from "vitest";
import { buildEngineNodes } from "./build-engine-nodes";
import { sampleConfig, tableDefinition } from "./fixtures";

describe("buildEngineNodes", () => {
  const nodes = buildEngineNodes(sampleConfig, { table: tableDefinition });

  it("turns a query's variables into the fields of its node", () => {
    expect(nodes).toContainEqual({
      id: "ordersQuery",
      fields: { venueId: "{{ venueSelect.value }}" },
    });
  });

  it("leaves mutations out of the graph", () => {
    expect(nodes.map((node) => node.id)).not.toContain("markReady");
  });

  it("uses only the fields a widget definition marks as templated", () => {
    expect(nodes).toContainEqual({ id: "ordersTable", fields: { data: "{{ ordersQuery.data }}" } });
  });

  it("keeps widgets without a registered definition as nodes with no fields", () => {
    expect(nodes).toContainEqual({ id: "notes", fields: {} });
  });
});
