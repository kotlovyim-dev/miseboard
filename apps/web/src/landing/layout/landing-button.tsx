import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";

const VARIANTS = {
  paper: "bg-paper text-ink hover:bg-white",
  ink: "bg-ink text-paper hover:bg-ink/85",
  highlighter: "bg-highlighter text-highlighter-foreground hover:bg-highlighter/85",
} as const;

type LandingButtonProps<T extends string> = {
  variant: keyof typeof VARIANTS;
  className?: string;
  children: React.ReactNode;
} & ({ isExternal: true; href: string } | { isExternal?: false; href: Route<T> });

export function LandingButton<T extends string>({
  variant,
  className,
  children,
  ...link
}: LandingButtonProps<T>) {
  const classes = cn(
    "inline-flex h-14 items-center justify-center px-7 text-lg font-medium transition-[background-color,translate] duration-150 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current active:translate-y-px",
    VARIANTS[variant],
    className,
  );

  if (link.isExternal) {
    return (
      <a href={link.href} className={classes} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={link.href} className={classes}>
      {children}
    </Link>
  );
}
