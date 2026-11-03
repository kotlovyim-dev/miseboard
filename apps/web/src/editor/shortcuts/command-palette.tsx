"use client";

import { Command } from "cmdk";
import { PALETTE_GROUPS } from "@/editor/palette/palette-groups";
import { useEditorStore } from "@/editor/store/editor-store";
import { ROLES, useSwitchRole } from "@/lib/role/use-switch-role";
import { widgetRegistry } from "@/widgets/registry";

const WIDGET_TYPES = PALETTE_GROUPS.flatMap((group) => group.entries.map((entry) => entry.type));

const GROUP_CLASS =
  "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground";
const ITEM_CLASS =
  "flex cursor-default items-center rounded-md px-2 py-1.5 text-sm outline-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground";

interface CommandPaletteProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function CommandPalette({ isOpen, onOpenChange }: CommandPaletteProps) {
  const mode = useEditorStore((state) => state.mode);
  const queries = useEditorStore((state) => state.config.queries);
  const addWidget = useEditorStore((state) => state.addWidget);
  const setMode = useEditorStore((state) => state.setMode);
  const setActiveQueryId = useEditorStore((state) => state.setActiveQueryId);
  const { switchRole } = useSwitchRole();

  const run = (action: () => void) => () => {
    action();
    onOpenChange(false);
  };

  return (
    <Command.Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
      label="Command palette"
      overlayClassName="fixed inset-0 z-50 bg-foreground/40"
      contentClassName="fixed top-1/4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg"
    >
      <Command.Input
        placeholder="Type a command"
        className="w-full border-b border-border bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
      />
      <Command.List className="max-h-80 overflow-auto p-2">
        <Command.Empty className="px-2 py-6 text-center text-sm text-muted-foreground">
          No matching command.
        </Command.Empty>
        {mode === "edit" && (
          <Command.Group heading="Add widget" className={GROUP_CLASS}>
            {WIDGET_TYPES.map((type) => (
              <Command.Item
                key={type}
                value={`Add widget ${type}`}
                onSelect={run(() => addWidget(type))}
                className={ITEM_CLASS}
              >
                {widgetRegistry[type]?.label ?? type}
              </Command.Item>
            ))}
          </Command.Group>
        )}
        {queries.length > 0 && (
          <Command.Group heading="Go to query" className={GROUP_CLASS}>
            {queries.map(({ id }) => (
              <Command.Item
                key={id}
                value={`Go to query ${id}`}
                onSelect={run(() => {
                  setMode("edit");
                  setActiveQueryId(id);
                })}
                className={ITEM_CLASS}
              >
                {id}
              </Command.Item>
            ))}
          </Command.Group>
        )}
        {mode === "edit" && (
          <Command.Group heading="History" className={GROUP_CLASS}>
            <Command.Item
              onSelect={run(() => useEditorStore.temporal.getState().undo())}
              className={ITEM_CLASS}
            >
              Undo
            </Command.Item>
            <Command.Item
              onSelect={run(() => useEditorStore.temporal.getState().redo())}
              className={ITEM_CLASS}
            >
              Redo
            </Command.Item>
          </Command.Group>
        )}
        <Command.Group heading="View" className={GROUP_CLASS}>
          <Command.Item
            onSelect={run(() => setMode(mode === "edit" ? "preview" : "edit"))}
            className={ITEM_CLASS}
          >
            Toggle preview
          </Command.Item>
        </Command.Group>
        <Command.Group heading="Switch role" className={GROUP_CLASS}>
          {ROLES.map(({ role, label }) => (
            <Command.Item
              key={role}
              value={`Switch role ${label}`}
              onSelect={run(() => switchRole(role))}
              className={ITEM_CLASS}
            >
              {label}
            </Command.Item>
          ))}
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
