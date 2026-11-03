"use client";

import { Group, Panel, useDefaultLayout } from "react-resizable-panels";
import { CanvasPanel } from "@/editor/canvas/canvas-panel";
import { EditorDnd } from "@/editor/canvas/editor-dnd";
import { PalettePanel } from "@/editor/palette/palette-panel";
import { EditorPanel } from "./editor-panel";
import { ResizeHandle } from "./resize-handle";

const SIDE_PANEL_MIN_PX = 180;
const SIDE_PANEL_MAX_PX = 480;
const PALETTE_DEFAULT_PX = 220;
const INSPECTOR_DEFAULT_PX = 320;
const QUERY_PANEL_DEFAULT = "35%";
const QUERY_PANEL_MIN = "15%";
const QUERY_PANEL_COLLAPSED_PX = 36;

export function EditorPanels({ role }: { role: string }) {
  const columns = useDefaultLayout({ id: "editor-columns" });
  const rows = useDefaultLayout({ id: "editor-rows" });

  return (
    <EditorDnd>
      <Group orientation="horizontal" {...columns}>
        <Panel
          id="palette"
          defaultSize={PALETTE_DEFAULT_PX}
          minSize={SIDE_PANEL_MIN_PX}
          maxSize={SIDE_PANEL_MAX_PX}
          groupResizeBehavior="preserve-pixel-size"
        >
          <PalettePanel />
        </Panel>
        <ResizeHandle direction="vertical" />
        <Panel id="center" minSize="30%">
          <Group orientation="vertical" {...rows}>
            <Panel id="canvas" minSize="20%">
              <CanvasPanel role={role} />
            </Panel>
            <ResizeHandle direction="horizontal" />
            <Panel
              id="queries"
              defaultSize={QUERY_PANEL_DEFAULT}
              minSize={QUERY_PANEL_MIN}
              collapsible
              collapsedSize={QUERY_PANEL_COLLAPSED_PX}
            >
              <EditorPanel title="Queries" hint="Named GraphQL queries and mutations." />
            </Panel>
          </Group>
        </Panel>
        <ResizeHandle direction="vertical" />
        <Panel
          id="inspector"
          defaultSize={INSPECTOR_DEFAULT_PX}
          minSize={SIDE_PANEL_MIN_PX}
          maxSize={SIDE_PANEL_MAX_PX}
          groupResizeBehavior="preserve-pixel-size"
        >
          <EditorPanel title="Inspector" hint="Select a widget to edit its properties." />
        </Panel>
      </Group>
    </EditorDnd>
  );
}
