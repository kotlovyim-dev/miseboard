export const CANVAS_DROPPABLE_ID = "canvas";

export interface MoveAction {
  kind: "move";
  from: number;
  to: number;
}

export function resolveDrop(
  widgetIds: string[],
  activeId: string,
  overId: string | null,
): MoveAction | null {
  if (overId === null) return null;
  const from = widgetIds.indexOf(activeId);
  const to = overId === CANVAS_DROPPABLE_ID ? widgetIds.length - 1 : widgetIds.indexOf(overId);
  if (from === -1 || to === -1 || from === to) return null;
  return { kind: "move", from, to };
}
