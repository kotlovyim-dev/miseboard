"use client";

import { useState } from "react";
import { Dialog } from "radix-ui";
import { Button } from "@/components/ui/button";
import { useResetDemo } from "@/lib/apps/use-reset-demo";

export function ResetDemoDialog() {
  const { reset, isResetting } = useResetDemo();
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = async () => {
    if (await reset()) setIsOpen(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button size="sm" variant="outline">
          Reset demo
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 space-y-4 rounded-xl border border-border bg-popover p-5 text-popover-foreground shadow-lg">
          <Dialog.Title className="text-base font-semibold">Reset demo data?</Dialog.Title>
          <Dialog.Description className="text-sm text-muted-foreground">
            This regenerates venues, menu, orders and inventory, and deletes apps older than 7 days.
            The Restaurant Ops template is kept.
          </Dialog.Description>
          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button type="button" variant="outline" size="sm">
                Keep data
              </Button>
            </Dialog.Close>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isResetting}
              onClick={() => void handleConfirm()}
            >
              Reset demo
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
