import { describe, expect, it } from "vitest";
import { planMutation } from "./inverse-registry";
import type { EntityCache } from "./inverse-registry";

function cacheWith(entity: Record<string, unknown> | null): EntityCache {
  return { identify: () => "Entity:1", readFragment: () => entity };
}

describe("planMutation", () => {
  it("returns an empty plan for an unknown mutation", () => {
    expect(planMutation(cacheWith(null), "createThing", { id: "1" })).toEqual({});
  });

  it("predicts a new order status and undoes to the previous one", () => {
    const plan = planMutation(cacheWith({ status: "PREPARING" }), "updateOrderStatus", {
      id: "o1",
      status: "READY",
    });

    expect(plan.optimisticResponse).toEqual({
      updateOrderStatus: { __typename: "Order", id: "o1", status: "READY" },
    });
    expect(plan.undo?.variables).toEqual({ id: "o1", status: "PREPARING" });
    expect(plan.message).toBe("Order marked READY");
  });

  it("offers no undo for an order that is not cached", () => {
    const plan = planMutation(cacheWith(null), "updateOrderStatus", { id: "o1", status: "READY" });

    expect(plan.undo).toBeUndefined();
  });

  it("adds the delta to the cached stock and undoes with the opposite delta", () => {
    const plan = planMutation(cacheWith({ qty: 4, minQty: 5 }), "adjustInventory", {
      id: "i1",
      delta: 10,
    });

    expect(plan.optimisticResponse).toEqual({
      adjustInventory: { __typename: "InventoryItem", id: "i1", qty: 14, isLow: false },
    });
    expect(plan.undo?.variables).toEqual({ id: "i1", delta: -10 });
  });

  it("skips the optimistic stock when the item is not cached", () => {
    const plan = planMutation(cacheWith(null), "adjustInventory", { id: "i1", delta: 2 });

    expect(plan.optimisticResponse).toBeUndefined();
    expect(plan.undo?.variables).toEqual({ id: "i1", delta: -2 });
  });

  it("merges menu item input and restores only the changed fields", () => {
    const plan = planMutation(
      cacheWith({ name: "Borscht", price: 9000, isActive: true }),
      "updateMenuItem",
      { input: { id: "m1", price: 9500 } },
    );

    expect(plan.optimisticResponse).toEqual({
      updateMenuItem: { __typename: "MenuItem", id: "m1", price: 9500 },
    });
    expect(plan.undo?.variables).toEqual({ input: { id: "m1", price: 9000 } });
  });
});
