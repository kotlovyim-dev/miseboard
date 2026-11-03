import { Separator } from "react-resizable-panels";
import { cn } from "@/lib/utils";

export function ResizeHandle({ direction }: { direction: "vertical" | "horizontal" }) {
  const size = direction === "vertical" ? "w-px" : "h-px";

  return (
    <Separator
      className={cn(
        "relative shrink-0 bg-border outline-none transition-colors duration-150 motion-reduce:transition-none",
        "hover:bg-ring focus-visible:bg-ring data-[separator=active]:bg-ring",
        size,
      )}
    />
  );
}
