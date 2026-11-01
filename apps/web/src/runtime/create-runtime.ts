import { createEngine } from "@miseboard/engine";
import type { AppConfigData } from "@miseboard/config";
import type { WidgetRegistry } from "@/widgets/registry";
import { buildEngineNodes } from "./build-engine-nodes";
import { buildScope } from "./connect-engine";
import { createRuntimeStore } from "./runtime-store";
import type { QueryState } from "./runtime-store";

export function createRuntime(config: AppConfigData, role: string, registry: WidgetRegistry) {
  const store = createRuntimeStore({
    role,
    widgetStates: buildWidgetStates(config, registry),
    queryStates: buildQueryStates(config),
  });
  const engine = createEngine(buildEngineNodes(config, registry));
  store.getState().mergeEvaluations(engine.evaluateAll(buildScope(store.getState())));
  return { store, engine };
}

function buildWidgetStates(config: AppConfigData, registry: WidgetRegistry) {
  return Object.fromEntries(
    config.widgets.map((widget) => [
      widget.id,
      registry[widget.type]?.initialState(widget.props) ?? {},
    ]),
  );
}

function buildQueryStates(config: AppConfigData): Record<string, QueryState> {
  return Object.fromEntries(
    config.queries
      .filter((query) => query.kind === "query")
      .map((query) => [
        query.id,
        { data: undefined, isLoading: query.trigger === "onLoad", error: null },
      ]),
  );
}
