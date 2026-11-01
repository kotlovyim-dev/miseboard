import type { Evaluations } from "@miseboard/engine";
import { createStore } from "zustand/vanilla";
import type { WidgetState } from "@/widgets/types";

export interface QueryState {
  data: unknown;
  isLoading: boolean;
  error: string | null;
}

export interface RuntimeState {
  role: string;
  widgetStates: Record<string, WidgetState>;
  queryStates: Record<string, QueryState>;
  evaluations: Evaluations;
  setRole: (role: string) => void;
  setWidgetState: (widgetId: string, state: WidgetState) => void;
  setQueryState: (queryId: string, state: QueryState) => void;
  mergeEvaluations: (changes: Evaluations) => void;
}

export type RuntimeStore = ReturnType<typeof createRuntimeStore>;

type InitialRuntimeState = Pick<RuntimeState, "role" | "widgetStates" | "queryStates">;

export function createRuntimeStore(initial: InitialRuntimeState) {
  return createStore<RuntimeState>()((set) => ({
    ...initial,
    evaluations: new Map(),
    setRole: (role) => set({ role }),
    setWidgetState: (widgetId, state) =>
      set((current) => ({ widgetStates: { ...current.widgetStates, [widgetId]: state } })),
    setQueryState: (queryId, state) =>
      set((current) => ({ queryStates: { ...current.queryStates, [queryId]: state } })),
    mergeEvaluations: (changes) =>
      set((current) => ({ evaluations: new Map([...current.evaluations, ...changes]) })),
  }));
}
