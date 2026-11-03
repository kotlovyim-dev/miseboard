import type { LandingSnapshot } from "./landing-snapshot";

export type OrderRow = LandingSnapshot["orders"]["edges"][number]["node"];

export function pickOrderRows(snapshot: LandingSnapshot, count: number): OrderRow[] {
  return snapshot.orders.edges.slice(0, count).map(({ node }) => node);
}
