import type { Context } from "../context";
import { decodeCursor, encodeCursor } from "../connections/cursor";
import { badInput } from "../errors";
import { countOrders, listOrdersPage } from "../repositories/order-repository";
import type { OrderFilters } from "../repositories/order-repository";
import { builder } from "./builder";
import { Order, OrderStatusEnum } from "./order";
import { Venue } from "./venue";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

interface OrderPageArgs {
  first?: number | null;
  after?: string | null;
}

interface PageInfoShape {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

type OrderRow = typeof Order.$inferType;

interface OrderConnectionShape {
  edges: { cursor: string; node: OrderRow }[];
  pageInfo: PageInfoShape;
  filters: OrderFilters;
}

const PageInfo = builder.objectRef<PageInfoShape>("PageInfo");

PageInfo.implement({
  fields: (t) => ({
    hasNextPage: t.exposeBoolean("hasNextPage"),
    hasPreviousPage: t.exposeBoolean("hasPreviousPage"),
    startCursor: t.exposeString("startCursor", { nullable: true }),
    endCursor: t.exposeString("endCursor", { nullable: true }),
  }),
});

const OrderEdge = builder.objectRef<OrderConnectionShape["edges"][number]>("OrderEdge");

OrderEdge.implement({
  fields: (t) => ({
    cursor: t.exposeString("cursor"),
    node: t.field({ type: Order, resolve: (edge) => edge.node }),
  }),
});

const OrderConnection = builder.objectRef<OrderConnectionShape>("OrderConnection");

OrderConnection.implement({
  fields: (t) => ({
    edges: t.field({ type: [OrderEdge], resolve: (connection) => connection.edges }),
    pageInfo: t.field({ type: PageInfo, resolve: (connection) => connection.pageInfo }),
    totalCount: t.int({
      resolve: (connection, _args, context) => countOrders(context.db, connection.filters),
    }),
  }),
});

async function resolveOrderConnection(
  context: Context,
  { first, after }: OrderPageArgs,
  filters: OrderFilters,
): Promise<OrderConnectionShape> {
  const pageSize = Math.min(first ?? DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
  if (pageSize < 1) throw badInput("first must be at least 1");
  const rows = await listOrdersPage(context.db, {
    ...filters,
    limit: pageSize + 1,
    after: after ? decodeCursor(after) : undefined,
  });
  const edges = rows
    .slice(0, pageSize)
    .map((order) => ({ cursor: encodeCursor(order), node: order }));
  return {
    edges,
    filters,
    pageInfo: {
      hasNextPage: rows.length > pageSize,
      hasPreviousPage: false,
      startCursor: edges[0]?.cursor ?? null,
      endCursor: edges.at(-1)?.cursor ?? null,
    },
  };
}

builder.queryField("orders", (t) =>
  t.field({
    type: OrderConnection,
    args: {
      first: t.arg.int({ defaultValue: DEFAULT_PAGE_SIZE }),
      after: t.arg.string(),
      venueId: t.arg.globalID({ for: Venue }),
      status: t.arg({ type: OrderStatusEnum }),
    },
    resolve: (_root, args, context) =>
      resolveOrderConnection(context, args, {
        venueId: args.venueId?.id,
        status: args.status ?? undefined,
      }),
  }),
);

builder.objectField(Venue, "orders", (t) =>
  t.field({
    type: OrderConnection,
    args: {
      first: t.arg.int({ defaultValue: DEFAULT_PAGE_SIZE }),
      after: t.arg.string(),
      status: t.arg({ type: OrderStatusEnum }),
    },
    resolve: (venue, args, context) =>
      resolveOrderConnection(context, args, {
        venueId: venue.id,
        status: args.status ?? undefined,
      }),
  }),
);
