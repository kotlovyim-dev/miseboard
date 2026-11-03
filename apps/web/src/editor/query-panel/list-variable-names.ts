import { Kind, parse } from "graphql";

export function listVariableNames(source: string): string[] {
  try {
    return parse(source)
      .definitions.filter((definition) => definition.kind === Kind.OPERATION_DEFINITION)
      .flatMap((operation) => operation.variableDefinitions ?? [])
      .map(({ variable }) => variable.name.value);
  } catch {
    return [];
  }
}
