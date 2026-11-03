import type { WidgetType } from "@miseboard/config";
import { BarChart3, FileText, Table2, type LucideIcon } from "lucide-react";

export interface PaletteEntry {
  type: WidgetType;
  hint: string;
  Icon: LucideIcon;
}

export interface PaletteGroup {
  title: string;
  entries: PaletteEntry[];
}

export const PALETTE_GROUPS: PaletteGroup[] = [
  {
    title: "Data",
    entries: [
      { type: "table", hint: "Rows from a query", Icon: Table2 },
      { type: "stat", hint: "One number, large", Icon: BarChart3 },
    ],
  },
  {
    title: "Content",
    entries: [{ type: "text", hint: "Markdown text", Icon: FileText }],
  },
];
