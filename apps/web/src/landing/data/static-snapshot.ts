import type { OrderStatus } from "@miseboard/schema";
import type { LandingSnapshot } from "./landing-snapshot";

const MINUTE_MS = 60 * 1000;

const venues = [
  { id: "venue-kashtan", name: "Kashtan Kitchen", revenue: [{ total: 1404500, orders: 15 }] },
  { id: "venue-dnipro", name: "Dnipro Table", revenue: [{ total: 982000, orders: 11 }] },
  { id: "venue-chaika", name: "Chaika Bistro", revenue: [{ total: 1126000, orders: 13 }] },
];

const orderSpecs = [
  { ageMinutes: 2, total: 49000 },
  { ageMinutes: 7, total: 112500 },
  { ageMinutes: 11, total: 172500 },
  { ageMinutes: 16, total: 88000 },
  { ageMinutes: 19, total: 63500 },
  { ageMinutes: 24, total: 112000 },
  { ageMinutes: 28, total: 58500 },
  { ageMinutes: 33, total: 78000 },
  { ageMinutes: 38, total: 63500 },
  { ageMinutes: 44, total: 141500 },
  { ageMinutes: 50, total: 95000 },
  { ageMinutes: 58, total: 52000 },
  { ageMinutes: 63, total: 134000 },
  { ageMinutes: 71, total: 68500 },
  { ageMinutes: 80, total: 101000 },
  { ageMinutes: 92, total: 47500 },
  { ageMinutes: 104, total: 156000 },
  { ageMinutes: 118, total: 83000 },
  { ageMinutes: 131, total: 71500 },
  { ageMinutes: 150, total: 124000 },
];

export function buildStaticSnapshot(now: Date): LandingSnapshot {
  return {
    venues,
    orders: {
      edges: orderSpecs.map(({ ageMinutes, total }, index) => ({
        node: {
          id: `order-${index + 1}`,
          status: statusForAge(ageMinutes),
          total,
          createdAt: new Date(now.getTime() - ageMinutes * MINUTE_MS).toISOString(),
        },
      })),
    },
  };
}

function statusForAge(ageMinutes: number): OrderStatus {
  if (ageMinutes < 15) return "NEW";
  if (ageMinutes < 30) return "PREPARING";
  if (ageMinutes < 45) return "READY";
  return "SERVED";
}
