import { CircleAlert } from "lucide-react";
import type { DocumentIssue } from "@/lib/schema/validate-document";

export function IssueList({ issues }: { issues: DocumentIssue[] }) {
  return (
    <ul aria-live="polite" className="space-y-1 text-xs text-destructive">
      {issues.map(({ line, message }) => (
        <li key={`${line}:${message}`} className="flex items-start gap-1.5">
          <CircleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.5} />
          <span className="font-mono tabular-nums">Line {line}</span>
          <span>{message}</span>
        </li>
      ))}
    </ul>
  );
}
