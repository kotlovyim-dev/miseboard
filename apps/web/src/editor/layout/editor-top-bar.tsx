import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RoleSwitcher } from "@/components/role-switcher";
import { SaveStatus } from "@/components/save-status";
import { ThemeToggle } from "@/components/theme-toggle";
import type { SaveStatus as Status } from "@/editor/persistence/autosave";
import { ModeToggle } from "./mode-toggle";

interface EditorTopBarProps {
  appName: string;
  saveStatus: Status;
  onRetry: () => void;
}

export function EditorTopBar({ appName, saveStatus, onRetry }: EditorTopBarProps) {
  return (
    <header className="grid h-10 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-border px-3">
      <div className="flex min-w-0 items-center gap-2">
        <Link
          href="/apps"
          aria-label="Back to apps"
          className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft aria-hidden className="size-4" strokeWidth={1.5} />
        </Link>
        <h1 className="truncate text-sm font-semibold">{appName}</h1>
      </div>
      <ModeToggle />
      <div className="flex items-center justify-end gap-3">
        <SaveStatus status={saveStatus} onRetry={onRetry} />
        <ThemeToggle />
        <RoleSwitcher />
      </div>
    </header>
  );
}
