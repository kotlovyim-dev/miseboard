import { gql } from "@apollo/client";
import { Kind } from "graphql";
import type { DocumentNode } from "graphql";

export const ORDER_POLL_INTERVAL_MS = 5000;

export const ORDER_UPDATED = gql`
  subscription OrderUpdated {
    orderUpdated {
      id
      status
      total
      createdAt
    }
  }
`;

export function selectsOrders(document: DocumentNode) {
  return document.definitions.some(
    (definition) =>
      definition.kind === Kind.OPERATION_DEFINITION &&
      definition.operation === "query" &&
      definition.selectionSet.selections.some(
        (selection) => selection.kind === Kind.FIELD && selection.name.value === "orders",
      ),
  );
}
