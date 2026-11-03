"use client";

import { useMemo } from "react";
import type { QueryConfig } from "@miseboard/config";
import { useEditorStore } from "@/editor/store/editor-store";
import { useClientSchema } from "@/lib/schema/use-client-schema";
import { validateDocument } from "@/lib/schema/validate-document";
import { DocumentEditor } from "./document-editor";
import { IssueList } from "./issue-list";
import { QueryHeader } from "./query-header";

export function QueryEditor({ query }: { query: QueryConfig }) {
  const updateQuery = useEditorStore((state) => state.updateQuery);
  const { schema, error } = useClientSchema();
  const issues = useMemo(() => validateDocument(query.document, schema), [query.document, schema]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <QueryHeader query={query} />
      <div className="min-h-0 flex-1 space-y-3 overflow-auto">
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
      </div>
    </div>
  );
}
