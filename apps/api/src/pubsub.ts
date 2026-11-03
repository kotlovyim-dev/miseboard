import { createPubSub } from "graphql-yoga";
import type { Order } from "@miseboard/db";

export type PubSub = ReturnType<typeof createOrderPubSub>;

export function createOrderPubSub() {
  return createPubSub<{ orderUpdated: [order: Order] }>();
}
