/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment OrderStatusValue on Order {\n    status\n  }\n": typeof types.OrderStatusValueFragmentDoc,
    "\n  query Apps {\n    apps {\n      id\n      name\n      slug\n      config\n      isTemplate\n      updatedAt\n    }\n  }\n": typeof types.AppsDocument,
    "\n  mutation CreateApp($name: String!, $fromTemplate: Boolean) {\n    createApp(name: $name, fromTemplate: $fromTemplate) {\n      id\n      name\n      slug\n      config\n      updatedAt\n    }\n  }\n": typeof types.CreateAppDocument,
    "\n  query Viewer {\n    viewer {\n      role\n    }\n  }\n": typeof types.ViewerDocument,
    "\n  mutation SetRole($role: Role!) {\n    setRole(role: $role) {\n      role\n    }\n  }\n": typeof types.SetRoleDocument,
};
const documents: Documents = {
    "\n  fragment OrderStatusValue on Order {\n    status\n  }\n": types.OrderStatusValueFragmentDoc,
    "\n  query Apps {\n    apps {\n      id\n      name\n      slug\n      config\n      isTemplate\n      updatedAt\n    }\n  }\n": types.AppsDocument,
    "\n  mutation CreateApp($name: String!, $fromTemplate: Boolean) {\n    createApp(name: $name, fromTemplate: $fromTemplate) {\n      id\n      name\n      slug\n      config\n      updatedAt\n    }\n  }\n": types.CreateAppDocument,
    "\n  query Viewer {\n    viewer {\n      role\n    }\n  }\n": types.ViewerDocument,
    "\n  mutation SetRole($role: Role!) {\n    setRole(role: $role) {\n      role\n    }\n  }\n": types.SetRoleDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment OrderStatusValue on Order {\n    status\n  }\n"): (typeof documents)["\n  fragment OrderStatusValue on Order {\n    status\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Apps {\n    apps {\n      id\n      name\n      slug\n      config\n      isTemplate\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query Apps {\n    apps {\n      id\n      name\n      slug\n      config\n      isTemplate\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateApp($name: String!, $fromTemplate: Boolean) {\n    createApp(name: $name, fromTemplate: $fromTemplate) {\n      id\n      name\n      slug\n      config\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateApp($name: String!, $fromTemplate: Boolean) {\n    createApp(name: $name, fromTemplate: $fromTemplate) {\n      id\n      name\n      slug\n      config\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Viewer {\n    viewer {\n      role\n    }\n  }\n"): (typeof documents)["\n  query Viewer {\n    viewer {\n      role\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetRole($role: Role!) {\n    setRole(role: $role) {\n      role\n    }\n  }\n"): (typeof documents)["\n  mutation SetRole($role: Role!) {\n    setRole(role: $role) {\n      role\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;