"use client";

import { useState } from "react";
import { Dialog } from "radix-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateApp } from "@/lib/apps/use-create-app";

const MAX_NAME_LENGTH = 80;

export function NewAppDialog({ disabledReason }: { disabledReason?: string }) {
  const { create, isCreating } = useCreateApp();
  const [name, setName] = useState("");
  const trimmedName = name.trim();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (trimmedName) void create(trimmedName);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button size="sm" disabled={Boolean(disabledReason)} title={disabledReason}>
          New app
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-popover p-5 text-popover-foreground shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Dialog.Title className="text-base font-semibold">New app</Dialog.Title>
            <Dialog.Description className="sr-only">
              Name the app. You can change everything else in the editor.
            </Dialog.Description>
            <label className="block space-y-1.5 text-sm font-medium">
              Name
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={MAX_NAME_LENGTH}
                placeholder="Orders today"
                autoFocus
              />
            </label>
            <div className="flex justify-end gap-2">
              <Dialog.Close asChild>
                <Button type="button" variant="outline" size="sm">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit" size="sm" disabled={!trimmedName || isCreating}>
                Create app
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
