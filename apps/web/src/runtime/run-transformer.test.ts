import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { runTransformer, TRANSFORMER_TIMEOUT_MS } from "./run-transformer";
import type { TransformerWorker } from "./run-transformer";

function createFakeWorker(reply?: { ok: true; value: unknown } | { ok: false; error: string }) {
  const worker: TransformerWorker = {
    onmessage: null,
    onerror: null,
    postMessage: () => {
      if (reply) worker.onmessage?.(new MessageEvent("message", { data: reply }));
    },
    terminate: vi.fn(),
  };
  return worker;
}

describe("runTransformer", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("resolves with the value the worker returns and stops the worker", async () => {
    const worker = createFakeWorker({ ok: true, value: [1, 2] });

    await expect(runTransformer("return data", {}, () => worker)).resolves.toEqual([1, 2]);
    expect(worker.terminate).toHaveBeenCalledOnce();
  });

  it("rejects with the error the snippet threw", async () => {
    const worker = createFakeWorker({ ok: false, error: "data is not iterable" });

    await expect(runTransformer("return [...data]", 1, () => worker)).rejects.toThrow(
      "data is not iterable",
    );
  });

  it("rejects and terminates the worker after the timeout", async () => {
    const worker = createFakeWorker();
    const outcome = expect(runTransformer("while (true) {}", {}, () => worker)).rejects.toThrow(
      "Transformer timed out after 1000 ms",
    );

    await vi.advanceTimersByTimeAsync(TRANSFORMER_TIMEOUT_MS);

    await outcome;
    expect(worker.terminate).toHaveBeenCalledOnce();
  });
});
