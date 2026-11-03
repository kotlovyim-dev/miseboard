"use client";

import { useShallow } from "zustand/react/shallow";
import type { WidgetConfig } from "@miseboard/config";
import { IdChip } from "@/components/id-chip";
import { widgetRegistry } from "@/widgets/registry";
import { describeVariables } from "./describe-variables";
import { readVariables } from "./query-runner";
import type { RuntimeStore } from "./runtime-store";
import { useRuntime, useRuntimeStore } from "./runtime-context";
import { useWidgetProps } from "./use-widget-props";
import { WidgetFrame } from "./widget-frame";

export function WidgetRenderer({ widget }: { widget: WidgetConfig }) {
  const { store, retryQuery } = useRuntime();
  const { props, errors, queryIds } = useWidgetProps(widget.id);
  const state = useRuntimeStore((runtime) => runtime.widgetStates[widget.id]);
  const queryStates = useRuntimeStore(
    useShallow((runtime) => queryIds.map((queryId) => runtime.queryStates[queryId])),
  );
  const definition = widgetRegistry[widget.type];

  const queries = queryIds.map((queryId, index) => ({ queryId, state: queryStates[index] }));
  const failedQueries = queries.filter((query) => query.state?.error);
  const queryErrors = failedQueries.map((query) => `${query.queryId}: ${query.state?.error}`);
  const missingDefinition = definition ? [] : [`${widget.id}: no widget of type "${widget.type}"`];

  return (
    <WidgetFrame
      errors={[...missingDefinition, ...errors, ...queryErrors]}
      isLoading={!state || queries.some((query) => query.state?.isLoading)}
      emptyMessage={describeEmpty(props.data, queryIds, store)}
      skeleton={definition && <definition.Skeleton />}
      onRetry={
        failedQueries.length
          ? () => failedQueries.forEach((query) => retryQuery(query.queryId))
          : undefined
      }
    >
      {definition && (
        <definition.Component
          id={widget.id}
          props={props}
          state={state ?? {}}
          setState={(next) => store.getState().setWidgetState(widget.id, next)}
        />
      )}
    </WidgetFrame>
  );
}

function describeEmpty(data: unknown, queryIds: string[], store: RuntimeStore) {
  if (!Array.isArray(data) || data.length > 0) return null;
  if (queryIds.length === 0) return "There are no rows to show.";
  return (
    <>
      {queryIds.map((queryId) => (
        <EmptyQuery key={queryId} queryId={queryId} store={store} />
      ))}
    </>
  );
}

function EmptyQuery({ queryId, store }: { queryId: string; store: RuntimeStore }) {
  const variables = readVariables(store, queryId);
  const scope = variables.ok ? describeVariables(variables.values) : "";

  return (
    <span className="mr-2">
      <IdChip id={queryId} className="mr-1" />
      returned no rows{scope && ` for ${scope}`}.
    </span>
  );
}
