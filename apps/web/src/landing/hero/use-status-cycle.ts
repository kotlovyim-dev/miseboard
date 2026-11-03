"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { OrderStatus } from "@/components/status-badge";

const CYCLE: OrderStatus[] = ["NEW", "PREPARING", "READY"];
const CYCLE_INTERVAL_MS = 1800;

export function useStatusCycle(): OrderStatus {
  const shouldReduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const timer = setInterval(() => setStep((current) => current + 1), CYCLE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return "READY";
  return CYCLE[step % CYCLE.length] ?? "NEW";
}
