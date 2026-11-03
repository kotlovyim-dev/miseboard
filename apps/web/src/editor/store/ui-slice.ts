import type { StateCreator } from "zustand";
import type { EditorState } from "./editor-store";

export type EditorMode = "edit" | "preview";

export interface UiSlice {
  mode: EditorMode;
  activeQueryId: string | null;
  pendingDeleteId: string | null;
  setMode: (mode: EditorMode) => void;
  setActiveQueryId: (id: string | null) => void;
  setPendingDeleteId: (id: string | null) => void;
}

export const createUiSlice: StateCreator<EditorState, [], [], UiSlice> = (set) => ({
  mode: "edit",
  activeQueryId: null,
  pendingDeleteId: null,
  setMode: (mode) => set({ mode }),
  setActiveQueryId: (id) => set({ activeQueryId: id }),
  setPendingDeleteId: (id) => set({ pendingDeleteId: id }),
});
