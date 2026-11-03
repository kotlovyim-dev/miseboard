"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PanelHeader } from "@/editor/layout/panel-header";
import { useEditorStore } from "@/editor/store/editor-store";
import { widgetRegistry } from "@/widgets/registry";
import { FieldEditor } from "./field-editor";
import { NodeIdField } from "./node-id-field";
import { useDeleteWidget } from "./use-delete-widget";
import { WidthControl } from "./width-control";

export function InspectorPanel() {
  const widget = useEditorStore((state) =>
    state.config.widgets.find((candidate) => candidate.id === state.selectedId),
  );
  const updateWidgetProps = useEditorStore((state) => state.updateWidgetProps);
  const setWidgetWidth = useEditorStore((state) => state.setWidgetWidth);
  const deleteWidget = useDeleteWidget();
  const definition = widget && widgetRegistry[widget.type];

  return (
    <section aria-label="Inspector" className="flex h-full min-h-0 flex-col overflow-hidden">
      <PanelHeader title="Inspector" />
      {!widget || !definition ? (
        <p className="p-3 text-sm text-muted-foreground">Select a widget to edit its properties.</p>
      ) : (
        <div className="min-h-0 flex-1 divide-y divide-border overflow-auto">
          <div className="space-y-3 p-3">
            <div className="flex items-center justify-between gap-2">
              <NodeIdField key={widget.id} id={widget.id} />
              <span className="ml-auto text-sm text-muted-foreground">{definition.label}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Delete ${widget.id}`}
                onClick={() => deleteWidget(widget.id)}
              >
                <Trash2 aria-hidden strokeWidth={1.5} />
              </Button>
            </div>
            <WidthControl
              width={widget.width}
              onChange={(width) => setWidgetWidth(widget.id, width)}
            />
          </div>
          <div className="space-y-4 p-3">
            {definition.inspectorFields.map((field) => (
              <FieldEditor
                key={`${widget.id}.${field.name}`}
                field={field}
                widgetId={widget.id}
                value={(widget.props as Record<string, unknown>)[field.name]}
                onChange={(value) => updateWidgetProps(widget.id, { [field.name]: value })}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
