import { createEngine } from "@miseboard/engine";
import type { Engine } from "@miseboard/engine";
import type { AppConfigData } from "@miseboard/config";
import type { WidgetRegistry } from "@/widgets/registry";
import type { WidgetState } from "@/widgets/types";
import { buildEngineNodes } from "./build-engine-nodes";
import { buildScope } from "./connect-engine";
import { createRuntimeStore } from "./runtime-store";
import type { QueryState, RuntimeStore } from "./runtime-store";

export function buildEngine(config: AppConfigData, registry: WidgetRegistry) {
  return createEngine(buildEngineNodes(config, registry));
}

export function createRuntime(config: AppConfigData, role: string, registry: WidgetRegistry) {
  const store = createRuntimeStore({ role, widgetStates: {}, queryStates: {} });
  const engine = buildEngine(config, registry);
  syncRuntime(store, engine, config, role, registry);
  return { store, engine };
}

export function syncRuntime(
  store: RuntimeStore,
  engine: Engine,
  config: AppConfigData,
  role: string,
  registry: WidgetRegistry,
) {
  const { widgetStates, queryStates } = store.getState();
  store.setState({
    role,
    widgetStates: buildWidgetStates(config, registry, widgetStates),
    queryStates: buildQueryStates(config, queryStates),
  });
  store.getState().mergeEvaluations(engine.evaluateAll(buildScope(store.getState())));
}

function buildWidgetStates(
  config: AppConfigData,
  registry: WidgetRegistry,
  existing: Record<string, WidgetState>,
) {
  return Object.fromEntries(
    config.widgets.map((widget) => [
      widget.id,
      existing[widget.id] ?? registry[widget.type]?.initialState(widget.props) ?? {},
    ]),
  );
}

function buildQueryStates(config: AppConfigData, existing: Record<string, QueryState>) {
  return Object.fromEntries(
    config.queries
      .filter((query) => query.kind === "query")
      .map((query) => [
        query.id,
        existing[query.id] ?? {
          data: undefined,
          isLoading: query.trigger === "onLoad",
          error: null,
        },
      ]),
  );
}
