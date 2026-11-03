import { GraphQLError, parse, validate, type GraphQLSchema } from "graphql";

export interface DocumentIssue {
  line: number;
  message: string;
}

export function validateDocument(source: string, schema?: GraphQLSchema): DocumentIssue[] {
  try {
    const document = parse(source);
    return schema ? validate(schema, document).map(toIssue) : [];
  } catch (error) {
    if (!(error instanceof GraphQLError)) throw error;
    return [toIssue(error)];
  }
}

function toIssue(error: GraphQLError): DocumentIssue {
  return { line: error.locations?.[0]?.line ?? 1, message: error.message };
}
