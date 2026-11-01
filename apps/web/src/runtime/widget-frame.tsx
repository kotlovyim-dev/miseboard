"use client";

import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WidgetErrorBoundary } from "./widget-error-boundary";

interface WidgetFrameProps {
  errors: string[];
  isLoading: boolean;
  emptyMessage: React.ReactNode;
  skeleton: React.ReactNode;
  onRetry?: () => void;
  children: React.ReactNode;
}

export function WidgetFrame({
  errors,
  isLoading,
  emptyMessage,
  skeleton,
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
      {isBusy && <LoadingState>{skeleton}</LoadingState>}
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

function LoadingState({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span className="sr-only">Loading</span>
      {children}
    </>
  );
}
