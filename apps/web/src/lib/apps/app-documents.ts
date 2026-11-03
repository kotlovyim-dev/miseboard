import { graphql } from "@miseboard/schema";

export const AppsQuery = graphql(`
  query Apps {
    apps {
      id
      name
      slug
      config
      isTemplate
      updatedAt
    }
  }
`);

export const CreateAppMutation = graphql(`
  mutation CreateApp($name: String!, $fromTemplate: Boolean) {
    createApp(name: $name, fromTemplate: $fromTemplate) {
      id
      name
      slug
      config
      updatedAt
    }
  }
`);

export const SaveAppMutation = graphql(`
  mutation SaveApp($id: ID!, $config: JSON!, $expectedUpdatedAt: DateTime!) {
    saveApp(id: $id, config: $config, expectedUpdatedAt: $expectedUpdatedAt) {
      __typename
      ... on App {
        id
        updatedAt
      }
      ... on VersionConflict {
        message
        latest {
          id
          name
          config
          updatedAt
        }
      }
    }
  }
`);

export const DeleteAppMutation = graphql(`
  mutation DeleteApp($id: ID!) {
    deleteApp(id: $id)
  }
`);
