import type { Context } from "../context";
import { findVenuesByIds, listVenues } from "../repositories/venues";
import { builder } from "./builder";

export const Venue = builder.loadableNode("Venue", {
  id: { resolve: (venue) => venue.id },
  load: (ids: string[], context: Context) => findVenuesByIds(context.db, ids),
  sort: (venue) => venue.id,
  fields: (t) => ({
    name: t.exposeString("name"),
    city: t.exposeString("city"),
  }),
});

builder.queryFields((t) => ({
  venues: t.field({
    type: [Venue],
    resolve: (_root, _args, context) => listVenues(context.db),
  }),
  venue: t.field({
    type: Venue,
    nullable: true,
    args: { id: t.arg.globalID({ required: true, for: Venue }) },
    resolve: (_root, args) => args.id.id,
  }),
}));
