import { filter, pipe } from "graphql-yoga";
import { builder } from "./builder";
import { Order } from "./order";
import { Venue } from "./venue";

builder.subscriptionType({
  fields: (t) => ({
    orderUpdated: t.field({
      type: Order,
      args: { venueId: t.arg.globalID({ for: Venue }) },
      subscribe: (_root, args, context) =>
        pipe(
          context.pubsub.subscribe("orderUpdated"),
          filter((order) => !args.venueId || order.venueId === args.venueId.id),
        ),
      resolve: (order) => order,
    }),
  }),
});
