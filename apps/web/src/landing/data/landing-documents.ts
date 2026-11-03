import { graphql } from "@miseboard/schema";

export const LandingQuery = graphql(`
  query Landing($from: DateTime!, $to: DateTime!) {
    venues {
      id
      name
      revenue(from: $from, to: $to) {
        total
        orders
      }
    }
    orders(first: 20) {
      edges {
        node {
          id
          status
          total
          createdAt
        }
      }
    }
  }
`);
