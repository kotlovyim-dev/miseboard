import { test } from "vitest";
import { createEngine } from "./engine";
import { ordersState, widgetNodes } from "./fixtures";

test("update after one change with forty widgets", async ({ bench }) => {
  const engine = createEngine(widgetNodes);
  engine.evaluateAll(ordersState);

  await bench("update", () => {
    engine.update("orders", ordersState);
  }).run();
});
