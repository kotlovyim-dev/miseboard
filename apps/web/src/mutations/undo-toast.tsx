import { toast } from "sonner";

const UNDO_DURATION_MS = 5000;

export function showUndoToast(message: string, onUndo: () => void) {
  toast(message, { duration: UNDO_DURATION_MS, action: { label: "Undo", onClick: onUndo } });
}

export function showErrorToast(message: string) {
  toast.error(message, { duration: Infinity, closeButton: true });
}
