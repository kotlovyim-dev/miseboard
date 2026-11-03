import type { AppConfigData } from "@miseboard/config";
import type { StoreApi } from "zustand";
import { debounce } from "@/runtime/debounce";
import type { EditorState } from "@/editor/store/editor-store";

export const SAVE_DEBOUNCE_MS = 800;

export type SaveStatus = "saving" | "saved" | "error" | "conflict";

export interface LatestVersion {
  updatedAt: string;
  config: AppConfigData;
}

export type SaveResult =
  { kind: "saved"; updatedAt: string } | { kind: "conflict"; latest: LatestVersion };

export interface AutosaveState {
  status: SaveStatus;
  latest: LatestVersion | null;
}

interface AutosaverOptions {
  store: Pick<StoreApi<EditorState>, "getState" | "subscribe">;
  config: AppConfigData;
  updatedAt: string;
  save: (config: AppConfigData, expectedUpdatedAt: string) => Promise<SaveResult>;
  onChange: (state: AutosaveState) => void;
}

export interface Autosaver {
  start: () => () => void;
  retry: () => void;
  reload: () => void;
  overwrite: () => void;
}

export function createAutosaver({
  store,
  config,
  updatedAt,
  save,
  onChange,
}: AutosaverOptions): Autosaver {
  let savedConfig = config;
  let expectedUpdatedAt = updatedAt;
  let isSaving = false;
  let state: AutosaveState = { status: "saved", latest: null };

  const update = (status: SaveStatus, latest: LatestVersion | null = null) => {
    state = { status, latest };
    onChange(state);
  };

  const flush = async () => {
    if (isSaving) return;
    const sent = store.getState().config;
    if (sent === savedConfig) return update("saved");
    isSaving = true;
    update("saving");
    try {
      const result = await save(sent, expectedUpdatedAt);
      if (result.kind === "conflict") return update("conflict", result.latest);
      savedConfig = sent;
      expectedUpdatedAt = result.updatedAt;
      if (store.getState().config !== sent) return schedule();
      update("saved");
    } catch {
      return update("error");
    } finally {
      isSaving = false;
    }
  };

  const schedule = debounce(() => void flush(), SAVE_DEBOUNCE_MS);

  const flushNow = () => {
    schedule.cancel();
    void flush();
  };

  return {
    start: () => {
      const unsubscribe = store.subscribe((current, previous) => {
        if (current.config === previous.config || state.status === "conflict") return;
        update("saving");
        schedule();
      });
      return () => {
        unsubscribe();
        flushNow();
      };
    },
    retry: flushNow,
    reload: () => {
      if (!state.latest) return;
      savedConfig = state.latest.config;
      expectedUpdatedAt = state.latest.updatedAt;
      store.getState().setConfig(state.latest.config);
      update("saved");
    },
    overwrite: () => {
      if (!state.latest) return;
      expectedUpdatedAt = state.latest.updatedAt;
      flushNow();
    },
  };
}
