"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const STACK = [
  "GraphQL Yoga",
  "Pothos",
  "DataLoader",
  "Drizzle",
  "PostgreSQL",
  "Apollo Client",
  "Next.js",
  "React",
  "Zustand",
  "dnd-kit",
  "CodeMirror",
  "TanStack Table",
  "Zod",
  "an expression engine",
];
const LIGHT_INTERVAL_MS = 2000;

export function StackSentence() {
  const shouldReduceMotion = useReducedMotion();
  const [lit, setLit] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const timer = setInterval(
      () => setLit((current) => (current + 1) % STACK.length),
      LIGHT_INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, [shouldReduceMotion]);

  return (
    <p className="max-w-[72ch] text-2xl leading-snug md:text-[28px] lg:text-[32px]">
      Built with{" "}
      {STACK.map((name, index) => (
        <span key={name}>
          <span
            className={cn(
              "transition-colors duration-[400ms]",
              index === lit && !shouldReduceMotion ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {name}
          </span>
          {index < STACK.length - 2 && ", "}
          {index === STACK.length - 2 && " and "}
        </span>
      ))}
      .
    </p>
  );
}
