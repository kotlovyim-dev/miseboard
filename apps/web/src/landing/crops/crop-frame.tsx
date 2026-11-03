import { cn } from "@/lib/utils";

export function CropFrame({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-ui className={cn("landing-ui rounded-md bg-card text-card-foreground", className)}>
      {children}
    </div>
  );
}
