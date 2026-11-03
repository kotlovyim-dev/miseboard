"use client";

import { AlertDialog } from "radix-ui";
import { IdChip } from "@/components/id-chip";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/editor/store/editor-store";
import { useRuntime } from "@/runtime/runtime-context";

export function DeleteWidgetDialog() {
  const { engine } = useRuntime();
  const pendingDeleteId = useEditorStore((state) => state.pendingDeleteId);
  const setPendingDeleteId = useEditorStore((state) => state.setPendingDeleteId);
  const removeWidget = useEditorStore((state) => state.removeWidget);
  const referencedBy = pendingDeleteId ? engine.referencesTo(pendingDeleteId) : [];

  const handleConfirm = () => {
    if (pendingDeleteId) removeWidget(pendingDeleteId);
    setPendingDeleteId(null);
  };

  return (
    <AlertDialog.Root
      open={pendingDeleteId !== null}
      onOpenChange={(isOpen) => !isOpen && setPendingDeleteId(null)}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-foreground/40" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 space-y-4 rounded-xl border border-border bg-popover p-5 text-popover-foreground shadow-lg">
          <AlertDialog.Title className="text-base font-semibold">
            Delete {pendingDeleteId && <IdChip id={pendingDeleteId} />}?
          </AlertDialog.Title>
          <AlertDialog.Description asChild>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>These still reference it and will show an unknown identifier error:</p>
              <ul className="flex flex-wrap gap-1.5">
                {referencedBy.map((id) => (
                  <li key={id}>
                    <IdChip id={id} />
                  </li>
                ))}
              </ul>
            </div>
          </AlertDialog.Description>
          <div className="flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <Button variant="outline" size="sm">
                Keep
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button variant="destructive" size="sm" onClick={handleConfirm}>
                Delete widget
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
