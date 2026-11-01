import { describe, expect, it } from "vitest";
import { createEngine } from "./engine";
import { ordersState, widgetNodes } from "./fixtures";

const RUNS = 50;
const BUDGET_MS = 16;

describe("engine budget", () => {
  it("re-evaluates forty widgets after one change in under 16 ms", () => {
    const engine = createEngine(widgetNodes);
    engine.evaluateAll(ordersState);

    const startedAt = performance.now();
    for (let run = 0; run < RUNS; run += 1) engine.update("orders", ordersState);
    const meanMs = (performance.now() - startedAt) / RUNS;

    expect(meanMs).toBeLessThan(BUDGET_MS);
  });
});
