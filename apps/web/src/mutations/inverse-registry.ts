import { gql } from "@apollo/client";
import type { ApolloCache } from "@apollo/client";

type Variables = Record<string, unknown>;
type Entity = Record<string, unknown>;

export interface InverseCall {
  document: string;
  variables: Variables;
}

export interface MutationPlan {
  optimisticResponse?: Variables;
  undo?: InverseCall;
  message?: string;
}

export type EntityCache = Pick<ApolloCache, "identify" | "readFragment">;

interface InverseMutation {
  typename: string;
  fields: string;
  entityId(variables: Variables): unknown;
  optimistic(variables: Variables, previous: Entity | null): Entity | null;
  inverse(variables: Variables, previous: Entity | null): InverseCall | null;
  message(variables: Variables): string;
}

const UPDATE_ORDER_STATUS = `mutation ($id: ID!, $status: OrderStatus!) {
  updateOrderStatus(id: $id, status: $status) { id status }
}`;

const ADJUST_INVENTORY = `mutation ($id: ID!, $delta: Float!) {
  adjustInventory(id: $id, delta: $delta) { id qty isLow }
}`;

const UPDATE_MENU_ITEM = `mutation ($input: UpdateMenuItemInput!) {
  updateMenuItem(input: $input) { id name price isActive }
}`;

export const inverseRegistry: Record<string, InverseMutation> = {
  updateOrderStatus: {
    typename: "Order",
    fields: "status",
    entityId: (variables) => variables.id,
    optimistic: (variables) => ({ id: variables.id, status: variables.status }),
    inverse: (variables, previous) =>
      previous && {
        document: UPDATE_ORDER_STATUS,
        variables: { id: variables.id, status: previous.status },
      },
    message: (variables) => `Order marked ${variables.status}`,
  },
  adjustInventory: {
    typename: "InventoryItem",
    fields: "qty minQty",
    entityId: (variables) => variables.id,
    optimistic: (variables, previous) => {
      const { delta } = variables;
      if (!previous || typeof delta !== "number") return null;
      if (typeof previous.qty !== "number" || typeof previous.minQty !== "number") return null;
      const qty = previous.qty + delta;
      return { id: variables.id, qty, isLow: qty < previous.minQty };
    },
    inverse: (variables) =>
      typeof variables.delta === "number"
        ? { document: ADJUST_INVENTORY, variables: { id: variables.id, delta: -variables.delta } }
        : null,
    message: (variables) => `Stock adjusted by ${variables.delta}`,
  },
  updateMenuItem: {
    typename: "MenuItem",
    fields: "name price isActive",
    entityId: (variables) => readInput(variables).id,
    optimistic: (variables) => readInput(variables),
    inverse: (variables, previous) => {
      if (!previous) return null;
      const input = readInput(variables);
      const restored = Object.fromEntries(Object.keys(input).map((key) => [key, previous[key]]));
      return { document: UPDATE_MENU_ITEM, variables: { input: { ...restored, id: input.id } } };
    },
    message: () => "Menu item updated",
  },
};

export function planMutation(
  cache: EntityCache,
  rootField: string,
  variables: Variables,
): MutationPlan {
  const entry = inverseRegistry[rootField];
  if (!entry) return {};
  const previous = readPrevious(cache, entry, variables);
  const optimistic = entry.optimistic(variables, previous);
  return {
    optimisticResponse: optimistic
      ? { [rootField]: { __typename: entry.typename, ...optimistic } }
      : undefined,
    undo: entry.inverse(variables, previous) ?? undefined,
    message: entry.message(variables),
  };
}

function readPrevious(cache: EntityCache, entry: InverseMutation, variables: Variables) {
  const id = entry.entityId(variables);
  if (typeof id !== "string") return null;
  const previous = cache.readFragment({
    id: cache.identify({ __typename: entry.typename, id }),
    fragment: gql(`fragment Previous on ${entry.typename} { ${entry.fields} }`),
  });
  return isEntity(previous) ? previous : null;
}

function readInput(variables: Variables): Entity {
  return isEntity(variables.input) ? variables.input : {};
}

function isEntity(value: unknown): value is Entity {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
