import type { AppConfigData, QueryConfig, WidgetConfig } from "@miseboard/config";
import type { EngineNode } from "@miseboard/engine";
import type { WidgetRegistry } from "@/widgets/registry";

export function buildEngineNodes(config: AppConfigData, registry: WidgetRegistry): EngineNode[] {
  const queryNodes = config.queries.filter(isQuery).map(toQueryNode);
  const widgetNodes = config.widgets.map((widget) => toWidgetNode(widget, registry));
  return [...queryNodes, ...widgetNodes];
}

function isQuery(query: QueryConfig) {
  return query.kind === "query";
}

function toQueryNode(query: QueryConfig): EngineNode {
  return { id: query.id, fields: query.variables };
}

function toWidgetNode(widget: WidgetConfig, registry: WidgetRegistry): EngineNode {
  const fields = registry[widget.type]?.templatedFields(widget.props) ?? {};
  return { id: widget.id, fields };
}
