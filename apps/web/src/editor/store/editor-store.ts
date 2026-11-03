import { create } from "zustand";
import { createConfigSlice, type ConfigSlice } from "./config-slice";
import { createSelectionSlice, type SelectionSlice } from "./selection-slice";
import { createUiSlice, type UiSlice } from "./ui-slice";

export type EditorState = ConfigSlice & SelectionSlice & UiSlice;

export const useEditorStore = create<EditorState>()((...args) => ({
  ...createConfigSlice(...args),
  ...createSelectionSlice(...args),
  ...createUiSlice(...args),
}));
