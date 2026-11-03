"use client";

import { useMemo } from "react";
import type { QueryConfig } from "@miseboard/config";
import { ExpressionField } from "@/editor/inspector/expression-field";
import { useEditorStore } from "@/editor/store/editor-store";
import { listVariableNames } from "./list-variable-names";

export function VariablesEditor({ query }: { query: QueryConfig }) {
  const updateQuery = useEditorStore((state) => state.updateQuery);
  const names = useMemo(() => listVariableNames(query.document), [query.document]);

  if (names.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Declare variables in the document, like ($venueId: ID!), to bind them to expressions.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium tracking-[0.06em] text-muted-foreground uppercase">
        Variables
      </h3>
      {names.map((name) => (
        <ExpressionField
          key={name}
          field={{ kind: "template", name, label: `$${name}` }}
          widgetId={query.id}
          value={query.variables[name]}
          onChange={(value) =>
            updateQuery(query.id, { variables: { ...query.variables, [name]: String(value) } })
          }
        />
      ))}
    </div>
  );
}
