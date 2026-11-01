import { listDailyRevenue } from "../repositories/revenue";
import { builder } from "./builder";
import { Venue } from "./venue";

const RevenuePoint = builder.objectRef<{ day: Date; total: number; orders: number }>(
  "RevenuePoint",
);

RevenuePoint.implement({
  fields: (t) => ({
    day: t.field({ type: "DateTime", resolve: (point) => point.day }),
    total: t.exposeInt("total"),
    orders: t.exposeInt("orders"),
  }),
});

builder.objectField(Venue, "revenue", (t) =>
  t.field({
    type: [RevenuePoint],
    args: {
      from: t.arg({ type: "DateTime", required: true }),
      to: t.arg({ type: "DateTime", required: true }),
    },
    resolve: (venue, args, context) => listDailyRevenue(context.db, venue.id, args.from, args.to),
  }),
);
