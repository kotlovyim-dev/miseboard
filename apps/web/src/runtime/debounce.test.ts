import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { debounce } from "./debounce";

describe("debounce", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("waits for the delay before running", () => {
    const run = vi.fn();
    debounce(run, 250)();

    vi.advanceTimersByTime(249);
    expect(run).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(run).toHaveBeenCalledOnce();
  });

  it("runs once with the last arguments after a burst of calls", () => {
    const run = vi.fn();
    const debounced = debounce(run, 250);

    debounced("a");
    vi.advanceTimersByTime(100);
    debounced("b");
    vi.advanceTimersByTime(100);
    debounced("c");
    vi.advanceTimersByTime(250);

    expect(run).toHaveBeenCalledOnce();
    expect(run).toHaveBeenCalledWith("c");
  });

  it("does not run after cancel", () => {
    const run = vi.fn();
    const debounced = debounce(run, 250);

    debounced();
    debounced.cancel();
    vi.advanceTimersByTime(1000);

    expect(run).not.toHaveBeenCalled();
  });
});
