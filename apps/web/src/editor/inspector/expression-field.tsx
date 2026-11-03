"use client";

import { useId } from "react";
import { CircleAlert } from "lucide-react";
import type { EvaluationResult } from "@miseboard/engine";
import { Input } from "@/components/ui/input";
import { useRuntimeStore } from "@/runtime/runtime-context";
import type { FieldEditorProps, FieldOfKind } from "./field-editor-props";
import { describeValue, findErrorSpan } from "./value-preview";

export function ExpressionField({
  field,
  widgetId,
  value,
  onChange,
}: FieldEditorProps<FieldOfKind<"template">>) {
  const inputId = useId();
  const previewId = useId();
  const source = String(value ?? "");
  const result = useRuntimeStore((state) => state.evaluations.get(widgetId)?.[field.name]);

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-sm font-medium">
        {field.label}
      </label>
      <Input
        id={inputId}
        value={source}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
        aria-invalid={result?.ok === false}
        aria-describedby={previewId}
        className="font-mono"
      />
      <div id={previewId} aria-live="polite">
        {result && <ValuePreview result={result} source={source} />}
      </div>
    </div>
  );
}

function ValuePreview({ result, source }: { result: EvaluationResult; source: string }) {
  if (result.ok) {
    return (
      <p className="font-mono text-xs break-all text-muted-foreground">
        {describeValue(result.value)}
      </p>
    );
  }
  const { start, end } = findErrorSpan(source, result.at);

  return (
    <div className="space-y-1 text-xs text-destructive">
      <p className="flex items-start gap-1.5">
        <CircleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.5} />
        {result.error}
      </p>
      <p className="font-mono break-all text-muted-foreground">
        {source.slice(0, start)}
        <u className="text-destructive decoration-wavy">{source.slice(start, end)}</u>
        {source.slice(end)}
      </p>
    </div>
  );
}
