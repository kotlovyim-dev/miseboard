"use client";

import { useMemo } from "react";
import { extractDependencies } from "@miseboard/engine";
import { widgetRegistry } from "@/widgets/registry";
import { mergeEvaluatedProps } from "./evaluated-props";
import type { EvaluatedWidgetProps } from "./evaluated-props";
import { useRuntime, useRuntimeStore } from "./runtime-context";

export interface WidgetPropsResult extends EvaluatedWidgetProps {
  queryIds: string[];
}

export function useWidgetProps(widgetId: string): WidgetPropsResult {
  const { config } = useRuntime();
  const evaluation = useRuntimeStore((state) => state.evaluations.get(widgetId));
  const widget = config.widgets.find((candidate) => candidate.id === widgetId);

  return useMemo(() => {
    if (!widget) throw new Error(`Unknown widget "${widgetId}"`);
    const fields = widgetRegistry[widget.type]?.templatedFields(widget.props) ?? {};
    const queryIds = config.queries
      .filter((query) => readsQuery(fields, query.id))
      .map(({ id }) => id);
    return { ...mergeEvaluatedProps(widgetId, widget.props, evaluation), queryIds };
  }, [config, widget, widgetId, evaluation]);
}

function readsQuery(fields: Record<string, string>, queryId: string) {
  return Object.values(fields).some((source) =>
    extractDependencies(source).some(({ name }) => name === queryId),
  );
}
