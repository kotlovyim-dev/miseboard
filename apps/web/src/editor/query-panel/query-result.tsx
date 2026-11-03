import { CircleAlert } from "lucide-react";
import { IdChip } from "@/components/id-chip";
import { isEmptyResult } from "./is-empty-result";
import { JsonTree } from "./json-tree";
import type { RunResult } from "@/runtime/query-runner";

interface QueryResultProps {
  queryId: string;
  result: RunResult | null;
  isRunning: boolean;
}

export function QueryResult({ queryId, result, isRunning }: QueryResultProps) {
  return (
    <div className="space-y-2" aria-busy={isRunning}>
      <h3 className="flex items-center gap-2 text-xs font-medium tracking-[0.06em] text-muted-foreground uppercase">
        Result
        {result?.durationMs !== undefined && (
          <span className="rounded-sm border border-border px-1.5 py-0.5 leading-none tracking-normal tabular-nums normal-case">
            {Math.round(result.durationMs)} ms
          </span>
        )}
      </h3>
      <ResultBody queryId={queryId} result={result} />
    </div>
  );
}

function ResultBody({ queryId, result }: Pick<QueryResultProps, "queryId" | "result">) {
  if (!result) {
    return <p className="text-sm text-muted-foreground">Run the query to see its response.</p>;
  }
  if (result.error !== undefined) {
    return (
      <p className="flex items-start gap-1.5 text-sm text-destructive">
        <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
        {result.error}
      </p>
    );
  }
  return (
    <>
      {isEmptyResult(result.data) && <EmptyNotice queryId={queryId} variables={result.variables} />}
      <div className="font-mono text-xs">
        <JsonTree value={result.data} />
      </div>
    </>
  );
}

function EmptyNotice({
  queryId,
  variables,
}: {
  queryId: string;
  variables: Record<string, unknown>;
}) {
  const hasVariables = Object.keys(variables).length > 0;

  return (
    <p className="text-sm text-muted-foreground">
      <IdChip id={queryId} /> returned no rows
      {hasVariables ? ` for ${JSON.stringify(variables)}` : " and has no variables"}.
    </p>
  );
}
