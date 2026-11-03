"use client";

import { formatSavedAt, formatSavedAtAbsolute } from "@/lib/format/format-saved-at";

export function SavedAt({ updatedAt }: { updatedAt: string }) {
  return (
    <time
      dateTime={updatedAt}
      title={formatSavedAtAbsolute(updatedAt)}
      suppressHydrationWarning
      className="text-sm text-muted-foreground"
    >
      {formatSavedAt(updatedAt)}
    </time>
  );
}
