"use client";

import { useId, useRef, useState } from "react";
import { CircleAlert } from "lucide-react";
import type { EvaluationResult } from "@miseboard/engine";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRuntimeScope, useRuntimeStore } from "@/runtime/runtime-context";
import { findCompletions } from "./completions";
import type { FieldEditorProps, FieldOfKind } from "./field-editor-props";
import { ReferenceChips } from "./reference-chips";
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
  const scope = useRuntimeScope();
  const inputRef = useRef<HTMLInputElement>(null);
  const [caret, setCaret] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const listId = useId();

  const completions = caret === null ? null : findCompletions(source, caret, scope);
  const items = completions?.items ?? [];
  const activeItem = items[Math.min(active, items.length - 1)];

  const syncCaret = (input: HTMLInputElement) => {
    setCaret(input.selectionStart);
    setActive(0);
  };

  const accept = (insert: string) => {
    if (!completions || caret === null) return;
    const next = source.slice(0, completions.from) + insert + source.slice(caret);
    const position = completions.from + insert.length;
    onChange(next);
    setCaret(position);
    setActive(0);
    requestAnimationFrame(() => inputRef.current?.setSelectionRange(position, position));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!activeItem) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((index) => (index + step + items.length) % items.length);
    } else if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      accept(activeItem.insert);
    } else if (event.key === "Escape") {
      event.stopPropagation();
      setCaret(null);
    }
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-sm font-medium">
        {field.label}
      </label>
      <div className="relative">
        <Input
          ref={inputRef}
          id={inputId}
          value={source}
          onChange={(event) => {
            onChange(event.target.value);
            syncCaret(event.target);
          }}
          onKeyDown={handleKeyDown}
          onKeyUp={(event) => {
            if (event.key.startsWith("Arrow") && activeItem) return;
            if (event.key === "Enter" || event.key === "Tab" || event.key === "Escape") return;
            syncCaret(event.currentTarget);
          }}
          onClick={(event) => syncCaret(event.currentTarget)}
          onBlur={() => setCaret(null)}
          spellCheck={false}
          autoComplete="off"
          role="combobox"
          aria-expanded={items.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeItem ? `${listId}-${activeItem.label}` : undefined}
          aria-invalid={result?.ok === false}
          aria-describedby={previewId}
          className="font-mono"
        />
        {items.length > 0 && (
          <ul
            id={listId}
            role="listbox"
            className="absolute inset-x-0 top-full z-10 mt-1 max-h-48 overflow-auto rounded-md border border-border bg-popover p-1 shadow-md"
          >
            {items.map((item, index) => (
              <li
                key={item.label}
                id={`${listId}-${item.label}`}
                role="option"
                aria-selected={item === activeItem}
                onMouseDown={(event) => {
                  event.preventDefault();
                  accept(item.insert);
                }}
                className={cn(
                  "cursor-pointer rounded-sm px-2 py-1 font-mono text-xs",
                  index === active && "bg-accent text-accent-foreground",
                )}
              >
                {item.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div id={previewId} aria-live="polite">
        {result && <ValuePreview result={result} source={source} />}
      </div>
      <ReferenceChips source={source} />
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
