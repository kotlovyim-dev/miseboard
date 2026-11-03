import { create } from "zustand";
import { temporal } from "zundo";
import { createConfigSlice, type ConfigSlice } from "./config-slice";
import { createSelectionSlice, type SelectionSlice } from "./selection-slice";
import { createUiSlice, type UiSlice } from "./ui-slice";

export type EditorState = ConfigSlice & SelectionSlice & UiSlice;

export const HISTORY_LIMIT = 100;

export const useEditorStore = create<EditorState>()(
  temporal(
    (...args) => ({
      ...createConfigSlice(...args),
      ...createSelectionSlice(...args),
      ...createUiSlice(...args),
    }),
    {
      partialize: ({ config }) => ({ config }),
      equality: (past, current) => past.config === current.config,
      limit: HISTORY_LIMIT,
    },
  ),
);
