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
