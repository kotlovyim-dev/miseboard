import { orderStatuses } from "@miseboard/db";
import type { Context } from "../context";
import { findOrdersByIds } from "../repositories/order-repository";
import { builder } from "./builder";

export const OrderStatusEnum = builder.enumType("OrderStatus", { values: orderStatuses });

export const Order = builder.loadableNode("Order", {
  id: { resolve: (order) => order.id },
  load: (ids: string[], context: Context) => findOrdersByIds(context.db, ids),
  sort: (order) => order.id,
  fields: (t) => ({
    status: t.field({ type: OrderStatusEnum, resolve: (order) => order.status }),
    total: t.exposeInt("totalKopecks"),
    createdAt: t.field({ type: "DateTime", resolve: (order) => order.createdAt }),
  }),
});
