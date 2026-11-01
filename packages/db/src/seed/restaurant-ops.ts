import { parseAppConfig } from "@miseboard/config";

const parsed = parseAppConfig({ version: 1, queries: [], widgets: [] });
if (!parsed.ok) {
  throw new Error(parsed.message);
}

export const restaurantOps = {
  name: "Restaurant Ops",
  slug: "restaurant-ops",
  config: parsed.config,
  isTemplate: true,
};
