"use client";

import { useMemo } from "react";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { graphql } from "cm6-graphql";
import type { GraphQLSchema } from "graphql";
import { useTheme } from "next-themes";

const DOCUMENT_LABEL = EditorView.contentAttributes.of({ "aria-label": "GraphQL document" });

interface DocumentEditorProps {
  value: string;
  schema?: GraphQLSchema;
  onChange: (value: string) => void;
}

export function DocumentEditor({ value, schema, onChange }: DocumentEditorProps) {
  const { resolvedTheme } = useTheme();
  const extensions = useMemo(() => [graphql(schema), DOCUMENT_LABEL], [schema]);

  return (
    <CodeMirror
      value={value}
      extensions={extensions}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      minHeight="96px"
      maxHeight="160px"
      onChange={onChange}
    />
  );
}
