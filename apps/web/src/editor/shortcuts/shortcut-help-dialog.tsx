"use client";

import { Dialog } from "radix-ui";

const SHORTCUTS = [
  { keys: "Ctrl/Cmd + K", description: "Open the command palette" },
  { keys: "Ctrl/Cmd + D", description: "Duplicate the selected widget" },
  { keys: "Delete", description: "Delete the selected widget" },
  { keys: "Esc", description: "Deselect" },
  { keys: "?", description: "Show this help" },
];

interface ShortcutHelpDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ShortcutHelpDialog({ isOpen, onOpenChange }: ShortcutHelpDialogProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 space-y-4 rounded-xl border border-border bg-popover p-5 text-popover-foreground shadow-lg">
          <Dialog.Title className="text-base font-semibold">Keyboard shortcuts</Dialog.Title>
          <Dialog.Description className="sr-only">
            Shortcuts available in the editor
          </Dialog.Description>
          <dl className="space-y-2 text-sm">
            {SHORTCUTS.map(({ keys, description }) => (
              <div key={keys} className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">{description}</dt>
                <dd>
                  <kbd className="rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">
                    {keys}
                  </kbd>
                </dd>
              </div>
            ))}
          </dl>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
