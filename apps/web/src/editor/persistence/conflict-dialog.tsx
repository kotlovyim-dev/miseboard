"use client";

import { AlertDialog } from "radix-ui";
import { Button } from "@/components/ui/button";

interface ConflictDialogProps {
  isOpen: boolean;
  onReload: () => void;
  onOverwrite: () => void;
}

export function ConflictDialog({ isOpen, onReload, onOverwrite }: ConflictDialogProps) {
  return (
    <AlertDialog.Root open={isOpen}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-foreground/40" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 space-y-4 rounded-xl border border-border bg-popover p-5 text-popover-foreground shadow-lg">
          <AlertDialog.Title className="text-base font-semibold">
            This app was changed somewhere else
          </AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-muted-foreground">
            Reload to take the newer version and drop your unsaved changes, or overwrite it with
            what you have here.
          </AlertDialog.Description>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onReload}>
              Reload
            </Button>
            <Button variant="destructive" size="sm" onClick={onOverwrite}>
              Overwrite
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
