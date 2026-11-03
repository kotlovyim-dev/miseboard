import {
  EMPTY_APP_CONFIG,
  type AppConfigData,
  type QueryConfig,
  type WidgetConfig,
  type WidgetType,
  type WidgetWidth,
} from "@miseboard/config";
import type { StateCreator } from "zustand";
import { widgetRegistry } from "@/widgets/registry";
import type { EditorState } from "./editor-store";
import { nextId } from "./next-id";
import { validateNodeId } from "./validate-node-id";

const DEFAULT_WIDGET_WIDTH: WidgetWidth = 6;
const QUERY_ID_PREFIX = "query";

export interface ConfigSlice {
  config: AppConfigData;
  setConfig: (config: AppConfigData) => void;
  addWidget: (type: WidgetType, index?: number) => void;
  removeWidget: (id: string) => void;
  moveWidget: (from: number, to: number) => void;
  updateWidgetProps: (id: string, props: Record<string, unknown>) => void;
  setWidgetWidth: (id: string, width: WidgetWidth) => void;
  renameNode: (id: string, newId: string) => void;
  addQuery: () => void;
  updateQuery: (id: string, changes: Partial<Omit<QueryConfig, "id">>) => void;
  removeQuery: (id: string) => void;
  restoreQuery: (query: QueryConfig, index: number) => void;
}

export const createConfigSlice: StateCreator<EditorState, [], [], ConfigSlice> = (set, get) => {
  const changeConfig = (changes: Partial<AppConfigData>) =>
    set(({ config }) => ({ config: { ...config, ...changes } }));

  const mapWidget = (id: string, change: (widget: WidgetConfig) => WidgetConfig) =>
    changeConfig({
      widgets: get().config.widgets.map((widget) => (widget.id === id ? change(widget) : widget)),
    });

  return {
    config: EMPTY_APP_CONFIG,
    setConfig: (config) => set({ config }),
    addWidget: (type, index) => {
      const definition = widgetRegistry[type];
      if (!definition) return;
      const { config } = get();
      const id = nextId(config, type);
      const queryIds = config.queries.map((query) => query.id);
      const widget = {
        id,
        type,
        width: DEFAULT_WIDGET_WIDTH,
        props: definition.defaultProps(id, { queryIds }),
      } as WidgetConfig;
      const widgets = [...config.widgets];
      widgets.splice(index ?? widgets.length, 0, widget);
      changeConfig({ widgets });
      set({ selectedId: id });
    },
    removeWidget: (id) => {
      changeConfig({ widgets: get().config.widgets.filter((widget) => widget.id !== id) });
      if (get().selectedId === id) set({ selectedId: null });
    },
    moveWidget: (from, to) => {
      const widgets = [...get().config.widgets];
      const [moved] = widgets.splice(from, 1);
      if (!moved) return;
      widgets.splice(to, 0, moved);
      changeConfig({ widgets });
    },
    updateWidgetProps: (id, props) =>
      mapWidget(
        id,
        (widget) => ({ ...widget, props: { ...widget.props, ...props } }) as WidgetConfig,
      ),
    setWidgetWidth: (id, width) => mapWidget(id, (widget) => ({ ...widget, width })),
    renameNode: (id, newId) => {
      const { config, selectedId, activeQueryId } = get();
      if (validateNodeId(config, id, newId)) return;
      const rename = <T extends { id: string }>(node: T) =>
        node.id === id ? { ...node, id: newId } : node;
      changeConfig({ widgets: config.widgets.map(rename), queries: config.queries.map(rename) });
      if (selectedId === id) set({ selectedId: newId });
      if (activeQueryId === id) set({ activeQueryId: newId });
    },
    addQuery: () => {
      const { config } = get();
      const id = nextId(config, QUERY_ID_PREFIX);
      const query: QueryConfig = {
        id,
        kind: "query",
        document: "",
        variables: {},
        trigger: "onLoad",
      };
      changeConfig({ queries: [...config.queries, query] });
      set({ activeQueryId: id });
    },
    updateQuery: (id, changes) =>
      changeConfig({
        queries: get().config.queries.map((query) =>
          query.id === id ? { ...query, ...changes } : query,
        ),
      }),
    removeQuery: (id) => {
      changeConfig({ queries: get().config.queries.filter((query) => query.id !== id) });
      if (get().activeQueryId === id) set({ activeQueryId: null });
    },
    restoreQuery: (query, index) => {
      const queries = [...get().config.queries];
      queries.splice(index, 0, query);
      changeConfig({ queries });
      set({ activeQueryId: query.id });
    },
  };
};
