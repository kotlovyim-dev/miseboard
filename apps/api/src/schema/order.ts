import { orderStatuses } from "@miseboard/db";
import type { OrderItem as OrderItemRow } from "@miseboard/db";
import type { Context } from "../context";
import { findOrderItemsByOrderIds, findOrdersByIds } from "../repositories/order-repository";
import { builder } from "./builder";
import { MenuItem } from "./menu-item";
import { Venue } from "./venue";

export const OrderStatusEnum = builder.enumType("OrderStatus", { values: orderStatuses });

const OrderItem = builder.objectRef<OrderItemRow>("OrderItem");

OrderItem.implement({
  fields: (t) => ({
    menuItem: t.field({ type: MenuItem, resolve: (item) => item.menuItemId }),
    qty: t.exposeInt("qty"),
    price: t.exposeInt("priceKopecks"),
  }),
});

export const Order = builder.loadableNode("Order", {
  id: { resolve: (order) => order.id },
  load: (ids: string[], context: Context) => findOrdersByIds(context.db, ids),
  sort: (order) => order.id,
  fields: (t) => ({
    venue: t.field({ type: Venue, resolve: (order) => order.venueId }),
    items: t.loadableList({
      type: OrderItem,
      load: (orderIds: string[], context: Context) =>
        findOrderItemsByOrderIds(context.db, orderIds),
      resolve: (order) => order.id,
    }),
    status: t.field({ type: OrderStatusEnum, resolve: (order) => order.status }),
    total: t.exposeInt("totalKopecks"),
    createdAt: t.field({ type: "DateTime", resolve: (order) => order.createdAt }),
  }),
});
