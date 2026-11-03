import { CircleAlert } from "lucide-react";
import type { EvaluationResult } from "@miseboard/engine";
import { describeValue, findErrorSpan } from "@/editor/inspector/value-preview";
import { cn } from "@/lib/utils";

interface BindingAnswerProps {
  source: string;
  result: EvaluationResult;
  className?: string;
}

export function BindingAnswer({ source, result, className }: BindingAnswerProps) {
  if (result.ok) {
    return (
      <p className={cn("text-2xl break-all", className)}>
        <code className="font-mono">{describeValue(result.value)}</code>
      </p>
    );
  }
  const { start, end } = findErrorSpan(source, result.at);

  return (
    <div className="space-y-2 text-destructive">
      <p className={cn("flex items-start gap-2 text-2xl", className)}>
        <CircleAlert aria-hidden className="mt-0.5 size-[1em] shrink-0" strokeWidth={1.5} />
        {result.error}
      </p>
      <p className="text-base break-all text-muted-foreground">
        <code className="font-mono">
          {source.slice(0, start)}
          <u className="text-destructive decoration-wavy">{source.slice(start, end)}</u>
          {source.slice(end)}
        </code>
      </p>
    </div>
  );
}
