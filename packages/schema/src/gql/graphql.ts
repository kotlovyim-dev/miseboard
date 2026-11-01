/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type OrderStatus =
  | 'CANCELLED'
  | 'NEW'
  | 'PREPARING'
  | 'READY'
  | 'SERVED';

export type OrderStatusValueFragment = { status: OrderStatus } & { ' $fragmentName'?: 'OrderStatusValueFragment' };

export const OrderStatusValueFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderStatusValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<OrderStatusValueFragment, unknown>;