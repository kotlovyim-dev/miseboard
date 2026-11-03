"use client";

import { Monitor } from "lucide-react";
import { useEditorStore } from "@/editor/store/editor-store";

export function DesktopNotice() {
  const setMode = useEditorStore((state) => state.setMode);

  return (
    <div
      role="status"
      className="flex shrink-0 items-center gap-2 border-b border-border bg-muted px-3 py-2 text-sm min-[1280px]:hidden"
    >
      <Monitor aria-hidden className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
      <p>
        The editor works best on a screen at least 1280 px wide.{" "}
        <button
          type="button"
          onClick={() => setMode("preview")}
          className="rounded-sm text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
        >
          Open Preview
        </button>
      </p>
    </div>
  );
}
