"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { Button } from "@/components/ui/button";
import { useDeleteApp } from "@/lib/apps/use-delete-app";

interface AppRowMenuProps {
  app: { id: string; name: string; config: unknown };
}

export function AppRowMenu({ app }: AppRowMenuProps) {
  const deleteApp = useDeleteApp();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${app.name}`}>
          <MoreHorizontal aria-hidden strokeWidth={1.5} />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="z-50 min-w-36 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
        >
          <DropdownMenu.Item
            onSelect={() => void deleteApp(app)}
            className="flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive outline-none data-[highlighted]:bg-accent"
          >
            <Trash2 aria-hidden className="size-4" strokeWidth={1.5} />
            Delete app
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
