"use client";

import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/editor/store/editor-store";
import { useCreateApp } from "@/lib/apps/use-create-app";

export function EmptyCanvas() {
  const addWidget = useEditorStore((state) => state.addWidget);
  const { createFromTemplate, isCreating } = useCreateApp();

  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border p-6">
      <div>
        <h3 className="font-display text-2xl">Your canvas is empty</h3>
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
          disabled={isCreating}
          onClick={() => void createFromTemplate()}
        >
          Open template
        </Button>
      </div>
    </div>
  );
}
