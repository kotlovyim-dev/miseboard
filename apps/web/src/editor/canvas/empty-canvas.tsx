"use client";

import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/editor/store/editor-store";

export function EmptyCanvas() {
  const addWidget = useEditorStore((state) => state.addWidget);

  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border p-6">
      <div>
        <h3 className="font-display text-base font-semibold">Your canvas is empty</h3>
        <p className="text-sm text-muted-foreground">
          Add a widget from the palette, or start with a table.
        </p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => addWidget("table")}>
          Add a table
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled
          title="The Restaurant Ops template is not available yet"
        >
          Open template
        </Button>
      </div>
    </div>
  );
}
