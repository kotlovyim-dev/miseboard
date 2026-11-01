export const SEED = 20260101;

export function createRandom(seed: number = SEED) {
  let state = seed;

  function next() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function int(min: number, max: number) {
    return min + Math.floor(next() * (max - min + 1));
  }

  function pick<T>(items: readonly T[]): T {
    return items[int(0, items.length - 1)] as T;
  }

  function weighted<T>(entries: readonly (readonly [T, number])[]): T {
    const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
    let target = next() * total;
    for (const [value, weight] of entries) {
      target -= weight;
      if (target < 0) return value;
    }
    return entries[entries.length - 1]?.[0] as T;
  }

  return { next, int, pick, weighted };
}
