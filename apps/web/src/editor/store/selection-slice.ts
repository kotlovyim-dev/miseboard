import type { StateCreator } from "zustand";
import type { EditorState } from "./editor-store";

export interface SelectionSlice {
  selectedId: string | null;
  hoveredReference: string | null;
  selectNode: (id: string | null) => void;
  setHoveredReference: (id: string | null) => void;
}

export const createSelectionSlice: StateCreator<EditorState, [], [], SelectionSlice> = (set) => ({
  selectedId: null,
  hoveredReference: null,
  selectNode: (id) => set({ selectedId: id }),
  setHoveredReference: (id) => set({ hoveredReference: id }),
});
