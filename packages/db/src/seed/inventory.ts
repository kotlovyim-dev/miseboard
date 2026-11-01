import { v7 } from "uuid";
import type { createRandom } from "./random";

const ingredients = [
  ["Potatoes", "kg"],
  ["Beetroot", "kg"],
  ["Cabbage", "kg"],
  ["Carrots", "kg"],
  ["Onions", "kg"],
  ["Pork shoulder", "kg"],
  ["Beef brisket", "kg"],
  ["Chicken fillet", "kg"],
  ["Trout", "kg"],
  ["Salo", "kg"],
  ["Wheat flour", "kg"],
  ["Cottage cheese", "kg"],
  ["Sour cream", "l"],
  ["Sunflower oil", "l"],
  ["Kefir", "l"],
  ["Butter", "kg"],
  ["Eggs", "pcs"],
  ["Dill", "bunch"],
  ["Rye bread", "pcs"],
  ["Honey", "kg"],
] as const;

const LOW_STOCK_EVERY = 8;

function stockLevels(random: ReturnType<typeof createRandom>, index: number) {
  const minQty = random.int(5, 20);
  const isLow = index % LOW_STOCK_EVERY === 0;
  const qty = isLow ? random.int(0, minQty - 1) : minQty + random.int(1, 30);
  return { qty, minQty };
}

export function buildInventory(
  random: ReturnType<typeof createRandom>,
  venueIds: readonly string[],
) {
  return venueIds
    .flatMap((venueId) => ingredients.map(([name, unit]) => ({ venueId, name, unit })))
    .map((item, index) => ({ id: v7(), ...item, ...stockLevels(random, index) }));
}
