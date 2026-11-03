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
    "\n  query App($slug: String!) {\n    app(slug: $slug) {\n      id\n      name\n      slug\n      config\n      updatedAt\n    }\n  }\n": typeof types.AppDocument,
    "\n  mutation CreateApp($name: String!, $fromTemplate: Boolean) {\n    createApp(name: $name, fromTemplate: $fromTemplate) {\n      id\n      name\n      slug\n      config\n      updatedAt\n    }\n  }\n": typeof types.CreateAppDocument,
    "\n  mutation SaveApp($id: ID!, $config: JSON!, $expectedUpdatedAt: DateTime!) {\n    saveApp(id: $id, config: $config, expectedUpdatedAt: $expectedUpdatedAt) {\n      __typename\n      ... on App {\n        id\n        updatedAt\n      }\n      ... on VersionConflict {\n        message\n        latest {\n          id\n          name\n          config\n          updatedAt\n        }\n      }\n    }\n  }\n": typeof types.SaveAppDocument,
    "\n  mutation DeleteApp($id: ID!) {\n    deleteApp(id: $id)\n  }\n": typeof types.DeleteAppDocument,
    "\n  mutation ResetDemo {\n    resetDemo\n  }\n": typeof types.ResetDemoDocument,
    "\n  query Viewer {\n    viewer {\n      role\n    }\n  }\n": typeof types.ViewerDocument,
    "\n  mutation SetRole($role: Role!) {\n    setRole(role: $role) {\n      role\n    }\n  }\n": typeof types.SetRoleDocument,
};
const documents: Documents = {
    "\n  fragment OrderStatusValue on Order {\n    status\n  }\n": types.OrderStatusValueFragmentDoc,
    "\n  query Apps {\n    apps {\n      id\n      name\n      slug\n      config\n      isTemplate\n      updatedAt\n    }\n  }\n": types.AppsDocument,
    "\n  query App($slug: String!) {\n    app(slug: $slug) {\n      id\n      name\n      slug\n      config\n      updatedAt\n    }\n  }\n": types.AppDocument,
    "\n  mutation CreateApp($name: String!, $fromTemplate: Boolean) {\n    createApp(name: $name, fromTemplate: $fromTemplate) {\n      id\n      name\n      slug\n      config\n      updatedAt\n    }\n  }\n": types.CreateAppDocument,
    "\n  mutation SaveApp($id: ID!, $config: JSON!, $expectedUpdatedAt: DateTime!) {\n    saveApp(id: $id, config: $config, expectedUpdatedAt: $expectedUpdatedAt) {\n      __typename\n      ... on App {\n        id\n        updatedAt\n      }\n      ... on VersionConflict {\n        message\n        latest {\n          id\n          name\n          config\n          updatedAt\n        }\n      }\n    }\n  }\n": types.SaveAppDocument,
    "\n  mutation DeleteApp($id: ID!) {\n    deleteApp(id: $id)\n  }\n": types.DeleteAppDocument,
    "\n  mutation ResetDemo {\n    resetDemo\n  }\n": types.ResetDemoDocument,
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
export function graphql(source: "\n  query App($slug: String!) {\n    app(slug: $slug) {\n      id\n      name\n      slug\n      config\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query App($slug: String!) {\n    app(slug: $slug) {\n      id\n      name\n      slug\n      config\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateApp($name: String!, $fromTemplate: Boolean) {\n    createApp(name: $name, fromTemplate: $fromTemplate) {\n      id\n      name\n      slug\n      config\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateApp($name: String!, $fromTemplate: Boolean) {\n    createApp(name: $name, fromTemplate: $fromTemplate) {\n      id\n      name\n      slug\n      config\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveApp($id: ID!, $config: JSON!, $expectedUpdatedAt: DateTime!) {\n    saveApp(id: $id, config: $config, expectedUpdatedAt: $expectedUpdatedAt) {\n      __typename\n      ... on App {\n        id\n        updatedAt\n      }\n      ... on VersionConflict {\n        message\n        latest {\n          id\n          name\n          config\n          updatedAt\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SaveApp($id: ID!, $config: JSON!, $expectedUpdatedAt: DateTime!) {\n    saveApp(id: $id, config: $config, expectedUpdatedAt: $expectedUpdatedAt) {\n      __typename\n      ... on App {\n        id\n        updatedAt\n      }\n      ... on VersionConflict {\n        message\n        latest {\n          id\n          name\n          config\n          updatedAt\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteApp($id: ID!) {\n    deleteApp(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteApp($id: ID!) {\n    deleteApp(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ResetDemo {\n    resetDemo\n  }\n"): (typeof documents)["\n  mutation ResetDemo {\n    resetDemo\n  }\n"];
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