import { cn } from "@/lib/utils";

interface LandingSectionProps {
  id?: string;
  headingId: string;
  className?: string;
  children: React.ReactNode;
}

export function LandingSection({ id, headingId, className, children }: LandingSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("px-4 py-20 md:px-8 md:py-28", className)}
    >
      {children}
    </section>
  );
}
