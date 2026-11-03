import { notFound } from "../errors";
import { updateOrderStatus } from "../repositories/order-repository";
import { builder } from "./builder";
import { Order, OrderStatusEnum } from "./order";

builder.mutationFields((t) => ({
  updateOrderStatus: t.field({
    type: Order,
    args: {
      id: t.arg.globalID({ required: true, for: Order }),
      status: t.arg({ type: OrderStatusEnum, required: true }),
    },
    resolve: async (_root, args, context) => {
      const order = await updateOrderStatus(context.db, args.id.id, args.status);
      if (!order) throw notFound("Order not found");
      context.pubsub.publish("orderUpdated", order);
      return order;
    },
  }),
}));
