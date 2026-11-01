import type { Engine, Scope } from "@miseboard/engine";
import type { RuntimeState, RuntimeStore } from "./runtime-store";

export function buildScope({ role, widgetStates, queryStates }: RuntimeState): Scope {
  return { ...widgetStates, ...queryStates, role };
}

export function connectEngine(store: RuntimeStore, engine: Engine) {
  return store.subscribe((state, previous) => {
    for (const id of findChangedIds(state, previous)) {
      store.getState().mergeEvaluations(engine.update(id, buildScope(state)));
    }
  });
}

function findChangedIds(state: RuntimeState, previous: RuntimeState) {
  return [
    ...changedKeys(state.widgetStates, previous.widgetStates),
    ...changedKeys(state.queryStates, previous.queryStates),
  ];
}

function changedKeys(current: Record<string, unknown>, previous: Record<string, unknown>) {
  return Object.keys(current).filter((key) => current[key] !== previous[key]);
}
