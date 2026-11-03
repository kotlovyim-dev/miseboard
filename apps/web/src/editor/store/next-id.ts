import type { AppConfigData } from "@miseboard/config";

export function nextId(config: AppConfigData, prefix: string) {
  const taken = new Set([...config.widgets, ...config.queries].map((node) => node.id));
  let number = 1;
  while (taken.has(`${prefix}${number}`)) number += 1;
  return `${prefix}${number}`;
}
