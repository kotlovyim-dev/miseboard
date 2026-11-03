import { cn } from "@/lib/utils";

export function SectionHeading({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h2 id={id} className={cn("font-display text-display leading-[0.92]", className)}>
      {children}
    </h2>
  );
}
