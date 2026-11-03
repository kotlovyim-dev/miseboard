import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EMPTY_APP_CONFIG } from "@miseboard/config";
import { useEditorStore } from "@/editor/store/editor-store";
import { SAVE_DEBOUNCE_MS, createAutosaver, type AutosaveState, type SaveResult } from "./autosave";

const store = useEditorStore;
const SAVED: SaveResult = { kind: "saved", updatedAt: "t2" };

function setup(results: (SaveResult | Error)[] = [SAVED]) {
  const save = vi.fn(async () => {
    const next = results.shift() ?? SAVED;
    if (next instanceof Error) throw next;
    return next;
  });
  const states: AutosaveState[] = [];
  const autosaver = createAutosaver({
    store,
    config: store.getState().config,
    updatedAt: "t1",
    save,
    onChange: (state) => states.push(state),
  });
  autosaver.start();
  const lastStatus = () => states.at(-1)?.status;
  return { save, autosaver, lastStatus };
}

beforeEach(() => {
  vi.useFakeTimers();
  store.setState(store.getInitialState(), true);
});
afterEach(() => vi.useRealTimers());

describe("autosave debounce", () => {
  it("saves once, 800 ms after the last edit", async () => {
    const { save, lastStatus } = setup();

    store.getState().addWidget("text");
    await vi.advanceTimersByTimeAsync(SAVE_DEBOUNCE_MS - 1);
    store.getState().addWidget("text");
    await vi.advanceTimersByTimeAsync(SAVE_DEBOUNCE_MS - 1);
    expect(save).not.toHaveBeenCalled();
    expect(lastStatus()).toBe("saving");

    await vi.advanceTimersByTimeAsync(1);
    expect(save).toHaveBeenCalledOnce();
    expect(save).toHaveBeenCalledWith(store.getState().config, "t1");
    expect(lastStatus()).toBe("saved");
  });

  it("sends the updatedAt returned by the previous save", async () => {
    const { save } = setup();

    store.getState().addWidget("text");
    await vi.advanceTimersByTimeAsync(SAVE_DEBOUNCE_MS);
    store.getState().addWidget("text");
    await vi.advanceTimersByTimeAsync(SAVE_DEBOUNCE_MS);

    expect(save).toHaveBeenLastCalledWith(store.getState().config, "t2");
  });

  it("saves edits made while a save is in flight", async () => {
    const { save } = setup();

    store.getState().addWidget("text");
    await vi.advanceTimersByTimeAsync(SAVE_DEBOUNCE_MS);
    store.getState().addWidget("text");
    store.getState().addWidget("text");
    await vi.advanceTimersByTimeAsync(SAVE_DEBOUNCE_MS);

    expect(save).toHaveBeenCalledTimes(2);
  });
});

describe("autosave errors", () => {
  it("reports the error and saves again on retry", async () => {
    const { save, autosaver, lastStatus } = setup([new Error("offline"), SAVED]);

    store.getState().addWidget("text");
    await vi.advanceTimersByTimeAsync(SAVE_DEBOUNCE_MS);
    expect(lastStatus()).toBe("error");

    autosaver.retry();
    await vi.advanceTimersByTimeAsync(0);
    expect(save).toHaveBeenCalledTimes(2);
    expect(lastStatus()).toBe("saved");
  });
});

describe("autosave conflicts", () => {
  const latestConfig = { ...EMPTY_APP_CONFIG, version: 1 as const };
  const conflict: SaveResult = {
    kind: "conflict",
    latest: { updatedAt: "t9", config: latestConfig },
  };

  it("stops saving until the conflict is resolved", async () => {
    const { save, lastStatus } = setup([conflict]);

    store.getState().addWidget("text");
    await vi.advanceTimersByTimeAsync(SAVE_DEBOUNCE_MS);
    store.getState().addWidget("text");
    await vi.advanceTimersByTimeAsync(SAVE_DEBOUNCE_MS);

    expect(lastStatus()).toBe("conflict");
    expect(save).toHaveBeenCalledOnce();
  });

  it("replaces the local config with the latest version on reload", async () => {
    const { save, autosaver, lastStatus } = setup([conflict]);
    store.getState().addWidget("text");
    await vi.advanceTimersByTimeAsync(SAVE_DEBOUNCE_MS);

    autosaver.reload();
    await vi.advanceTimersByTimeAsync(SAVE_DEBOUNCE_MS);

    expect(store.getState().config).toBe(latestConfig);
    expect(save).toHaveBeenCalledOnce();
    expect(lastStatus()).toBe("saved");
  });

  it("resaves the local config against the latest updatedAt on overwrite", async () => {
    const { save, autosaver, lastStatus } = setup([conflict, SAVED]);
    store.getState().addWidget("text");
    await vi.advanceTimersByTimeAsync(SAVE_DEBOUNCE_MS);
    const local = store.getState().config;

    autosaver.overwrite();
    await vi.advanceTimersByTimeAsync(0);

    expect(save).toHaveBeenLastCalledWith(local, "t9");
    expect(lastStatus()).toBe("saved");
  });
});
