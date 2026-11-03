import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RoleSwitcher } from "@/components/role-switcher";
import { ModeToggle } from "./mode-toggle";

export function EditorTopBar({ appName }: { appName: string }) {
  return (
    <header className="grid h-10 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-border px-3">
      <div className="flex min-w-0 items-center gap-2">
        <Link
          href="/"
          aria-label="Back to apps"
          className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft aria-hidden className="size-4" strokeWidth={1.5} />
        </Link>
        <h1 className="truncate font-display text-sm font-semibold">{appName}</h1>
      </div>
      <ModeToggle />
      <div className="flex justify-end">
        <RoleSwitcher />
      </div>
    </header>
  );
}
