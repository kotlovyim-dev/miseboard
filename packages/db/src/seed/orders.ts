import { v7 } from "uuid";
import type { OrderStatus } from "../schema";
import type { createRandom } from "./random";

type Random = ReturnType<typeof createRandom>;
interface Priced {
  id: string;
  priceKopecks: number;
}

const DAYS = 30;
const ORDERS_PER_DAY = 50;
const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const TODAY_WINDOW_MINUTES = 360;

const hourWeights: (readonly [number, number])[] = [
  [9, 1],
  [10, 2],
  [11, 4],
  [12, 10],
  [13, 10],
  [14, 5],
  [15, 2],
  [16, 2],
  [17, 4],
  [18, 9],
  [19, 10],
  [20, 8],
  [21, 4],
  [22, 1],
];

const pastStatuses: (readonly [OrderStatus, number])[] = [
  ["SERVED", 95],
  ["CANCELLED", 5],
];

function startOfUtcDay(time: number) {
  return time - (time % DAY_MS);
}

function pastCreatedAt(random: Random, now: number, daysAgo: number) {
  const hourMs = random.weighted(hourWeights) * 60 * MINUTE_MS;
  return startOfUtcDay(now) - daysAgo * DAY_MS + hourMs + random.int(0, 3599) * 1000;
}

function todayCreatedAt(random: Random, now: number) {
  const created = now - random.int(0, TODAY_WINDOW_MINUTES) * MINUTE_MS;
  return Math.max(created, startOfUtcDay(now));
}

function todayStatus(now: number, createdAt: number): OrderStatus {
  const ageMinutes = (now - createdAt) / MINUTE_MS;
  if (ageMinutes < 15) return "NEW";
  if (ageMinutes < 30) return "PREPARING";
  if (ageMinutes < 45) return "READY";
  return "SERVED";
}

function pickLines(random: Random, menu: readonly Priced[]) {
  const lines = new Map<string, { menuItemId: string; qty: number; priceKopecks: number }>();
  for (let i = random.int(1, 4); i > 0; i--) {
    const dish = random.pick(menu);
    const qty = random.int(1, 3);
    const line = lines.get(dish.id);
    if (line) line.qty += qty;
    else lines.set(dish.id, { menuItemId: dish.id, qty, priceKopecks: dish.priceKopecks });
  }
  return [...lines.values()];
}

function buildOrder(
  random: Random,
  now: number,
  daysAgo: number,
  venueIds: readonly string[],
  menu: readonly Priced[],
) {
  const createdAt =
    daysAgo === 0 ? todayCreatedAt(random, now) : pastCreatedAt(random, now, daysAgo);
  const status = daysAgo === 0 ? todayStatus(now, createdAt) : random.weighted(pastStatuses);
  const id = v7();
  const lines = pickLines(random, menu);
  const totalKopecks = lines.reduce((sum, line) => sum + line.qty * line.priceKopecks, 0);
  return {
    order: {
      id,
      venueId: random.pick(venueIds),
      status,
      totalKopecks,
      createdAt: new Date(createdAt),
    },
    items: lines.map((line) => ({ orderId: id, ...line })),
  };
}

export function buildOrders(
  random: Random,
  now: Date,
  venueIds: readonly string[],
  menu: readonly Priced[],
) {
  const built = Array.from({ length: DAYS * ORDERS_PER_DAY }, (_, i) =>
    buildOrder(random, now.getTime(), Math.floor(i / ORDERS_PER_DAY), venueIds, menu),
  );
  return {
    orders: built.map((b) => b.order),
    orderItems: built.flatMap((b) => b.items),
  };
}
