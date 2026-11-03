import { describe, expect, it } from "vitest";
import { buildStaticSnapshot } from "./static-snapshot";

const NOW = new Date("2026-11-03T12:00:00Z");

describe("buildStaticSnapshot", () => {
  it("lists twenty orders, newest first", () => {
    const { orders } = buildStaticSnapshot(NOW);

    const times = orders.edges.map(({ node }) => new Date(node.createdAt).getTime());

    expect(times).toHaveLength(20);
    expect(times).toEqual([...times].sort((a, b) => b - a));
  });

  it("gives an order a status from its age", () => {
    const { orders } = buildStaticSnapshot(NOW);

    const statuses = orders.edges.map(({ node }) => node.status);

    expect(statuses[0]).toBe("NEW");
    expect(statuses[3]).toBe("PREPARING");
    expect(statuses[7]).toBe("READY");
    expect(statuses[19]).toBe("SERVED");
  });
});
