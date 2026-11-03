"use client";

import { useMemo } from "react";
import type { QueryConfig } from "@miseboard/config";
import { useEditorStore } from "@/editor/store/editor-store";
import { useClientSchema } from "@/lib/schema/use-client-schema";
import { validateDocument } from "@/lib/schema/validate-document";
import { DocumentEditor } from "./document-editor";
import { IssueList } from "./issue-list";
import { QueryHeader } from "./query-header";
import { QueryResult } from "./query-result";
import { TransformerEditor } from "./transformer-editor";
import { useRunQuery } from "./use-run-query";
import { VariablesEditor } from "./variables-editor";

export function QueryEditor({ query }: { query: QueryConfig }) {
  const updateQuery = useEditorStore((state) => state.updateQuery);
  const { schema, error } = useClientSchema();
  const issues = useMemo(() => validateDocument(query.document, schema), [query.document, schema]);
  const { result, isRunning, run } = useRunQuery(query.id);
  const blockedReason = issues.length > 0 ? "Fix the errors in the document to run." : null;
  const canRun = blockedReason === null && !isRunning;

  const handleKeyDownCapture = (event: React.KeyboardEvent) => {
    if (event.key !== "Enter" || !(event.metaKey || event.ctrlKey)) return;
    event.preventDefault();
    event.stopPropagation();
    if (canRun) void run();
  };

  return (
    <div onKeyDownCapture={handleKeyDownCapture} className="flex h-full min-h-0 flex-col gap-3">
      <QueryHeader
        query={query}
        isRunning={isRunning}
        blockedReason={blockedReason}
        onRun={() => void run()}
      />
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
        <div className="min-h-0 space-y-3 overflow-auto">
          <DocumentEditor
            value={query.document}
            schema={schema}
            onChange={(document) => updateQuery(query.id, { document })}
          />
          <IssueList issues={issues} />
          {error && (
            <p className="text-xs text-muted-foreground">
              Couldn&apos;t load the schema, so only syntax is checked. Reload to try again.
            </p>
          )}
          <VariablesEditor query={query} />
          <TransformerEditor query={query} />
        </div>
        <div className="min-h-0 overflow-auto">
          <QueryResult queryId={query.id} result={result} isRunning={isRunning} />
        </div>
      </div>
    </div>
  );
}
