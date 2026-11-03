import { graphql } from "@miseboard/schema";

export const ViewerQuery = graphql(`
  query Viewer {
    viewer {
      role
    }
  }
`);

export const SetRoleMutation = graphql(`
  mutation SetRole($role: Role!) {
    setRole(role: $role) {
      role
    }
  }
`);
