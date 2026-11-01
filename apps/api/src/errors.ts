import { GraphQLError } from "graphql";

export function forbidden(message = "Not allowed") {
  return new GraphQLError(message, { extensions: { code: "FORBIDDEN" } });
}

export function badInput(message: string) {
  return new GraphQLError(message, { extensions: { code: "BAD_USER_INPUT" } });
}

export function notFound(message: string) {
  return new GraphQLError(message, { extensions: { code: "NOT_FOUND" } });
}
