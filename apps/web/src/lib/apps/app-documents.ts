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
