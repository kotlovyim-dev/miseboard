import type { WidgetType } from "@miseboard/config";

export const CANVAS_DROPPABLE_ID = "canvas";

export interface MoveAction {
  kind: "move";
  from: number;
  to: number;
}

export interface AddAction {
  kind: "add";
  type: WidgetType;
  index: number;
}

export type DropAction = MoveAction | AddAction;

export function resolveDrop(
  widgetIds: string[],
  activeId: string,
  overId: string | null,
  paletteType?: WidgetType,
): DropAction | null {
  if (overId === null) return null;
  const overIndex = widgetIds.indexOf(overId);
  const isOverCanvas = overId === CANVAS_DROPPABLE_ID;
  if (paletteType) {
    const index = isOverCanvas ? widgetIds.length : overIndex;
    return index === -1 ? null : { kind: "add", type: paletteType, index };
  }
  const from = widgetIds.indexOf(activeId);
  const to = isOverCanvas ? widgetIds.length - 1 : overIndex;
  if (from === -1 || to === -1 || from === to) return null;
  return { kind: "move", from, to };
}
