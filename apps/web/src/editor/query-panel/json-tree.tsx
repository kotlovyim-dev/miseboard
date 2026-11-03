import { cn } from "@/lib/utils";

interface JsonTreeProps {
  value: unknown;
  name?: string;
  depth?: number;
}

const OPEN_DEPTH = 3;

export function JsonTree({ value, name, depth = 0 }: JsonTreeProps) {
  const key = name === undefined ? null : <span className="text-muted-foreground">{name}: </span>;

  if (typeof value !== "object" || value === null) {
    return (
      <div className={cn("break-all", value === null && "text-muted-foreground")}>
        {key}
        {JSON.stringify(value)}
      </div>
    );
  }

  const entries = Object.entries(value);
  const [open, close] = Array.isArray(value) ? ["[", "]"] : ["{", "}"];

  return (
    <details open={depth < OPEN_DEPTH}>
      <summary className="cursor-pointer rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {key}
        {open}
        <span className="text-muted-foreground"> {entries.length} </span>
        {close}
      </summary>
      <div className="ml-4 border-l border-border pl-3">
        {entries.map(([entryKey, entry]) => (
          <JsonTree key={entryKey} name={entryKey} value={entry} depth={depth + 1} />
        ))}
      </div>
    </details>
  );
}
