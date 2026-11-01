"use client";

import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { WidgetErrorBoundary } from "./widget-error-boundary";

interface WidgetFrameProps {
  errors: string[];
  isLoading: boolean;
  emptyMessage: React.ReactNode;
  onRetry?: () => void;
  children: React.ReactNode;
}

const SKELETON_ROWS = 5;

export function WidgetFrame({
  errors,
  isLoading,
  emptyMessage,
  onRetry,
  children,
}: WidgetFrameProps) {
  const hasErrors = errors.length > 0;
  const isBusy = isLoading && !hasErrors;

  return (
    <section
      aria-busy={isBusy}
      className={cn(
        "rounded-lg border bg-card p-4 text-card-foreground",
        hasErrors && "border-destructive/50",
      )}
    >
      {hasErrors && <ErrorState messages={errors} onRetry={onRetry} />}
      {isBusy && <LoadingState />}
      {!hasErrors && !isLoading && <WidgetBody emptyMessage={emptyMessage}>{children}</WidgetBody>}
    </section>
  );
}

function WidgetBody({
  emptyMessage,
  children,
}: Pick<WidgetFrameProps, "emptyMessage" | "children">) {
  if (emptyMessage) return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  return (
    <WidgetErrorBoundary fallback={(message) => <ErrorState messages={[message]} />}>
      {children}
    </WidgetErrorBoundary>
  );
}

function ErrorState({ messages, onRetry }: { messages: string[]; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex items-start gap-3 text-sm">
      <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-destructive" />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="font-medium text-destructive">This widget can&apos;t show its data</p>
        {messages.map((message) => (
          <p key={message} className="break-words text-muted-foreground">
            {message}
          </p>
        ))}
        {onRetry && (
          <Button variant="secondary" size="sm" className="mt-2" onClick={onRetry}>
            Retry query
          </Button>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3">
      <span className="sr-only">Loading</span>
      <Skeleton className="h-4 w-1/3" />
      {Array.from({ length: SKELETON_ROWS }, (_, row) => (
        <Skeleton key={row} className="h-3 w-full" />
      ))}
    </div>
  );
}
