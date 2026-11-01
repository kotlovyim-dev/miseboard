"use client";

import type { WidgetWidth } from "@miseboard/config";
import { useRuntime } from "./runtime-context";
import { WidgetRenderer } from "./widget-renderer";

const COLUMN_SPAN: Record<WidgetWidth, string> = {
  3: "md:col-span-3",
  4: "md:col-span-4",
  6: "md:col-span-6",
  12: "md:col-span-12",
};

export function AppGrid() {
  const { config } = useRuntime();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
      {config.widgets.map((widget) => (
        <div key={widget.id} className={`min-w-0 ${COLUMN_SPAN[widget.width]}`}>
          <WidgetRenderer widget={widget} />
        </div>
      ))}
    </div>
  );
}
