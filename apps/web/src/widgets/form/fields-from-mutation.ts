import {
  getNamedType,
  isEnumType,
  isInputType,
  Kind,
  parse,
  typeFromAST,
  valueFromAST,
  type GraphQLSchema,
  type VariableDefinitionNode,
} from "graphql";
import type { FormFieldConfig, FormFieldType } from "./form-fields";

const NUMBER_TYPES = ["Int", "Float"];

export function fieldsFromMutation(schema: GraphQLSchema, document: string): FormFieldConfig[] {
  try {
    return parse(document)
      .definitions.filter((definition) => definition.kind === Kind.OPERATION_DEFINITION)
      .flatMap((operation) => operation.variableDefinitions ?? [])
      .map((definition) => toFormField(schema, definition));
  } catch {
    return [];
  }
}

function toFormField(schema: GraphQLSchema, definition: VariableDefinitionNode): FormFieldConfig {
  const name = definition.variable.name.value;
  const resolved = typeFromAST(schema, definition.type);
  const type = isInputType(resolved) ? resolved : undefined;
  const namedType = type && getNamedType(type);
  const field: FormFieldConfig = { name, label: toLabel(name), type: toFieldType(namedType) };

  if (isEnumType(namedType)) {
    const names = namedType.getValues().map(({ name: valueName }) => valueName);
    field.options = `{{ ${JSON.stringify(names)} }}`;
  }
  const defaultValue =
    type && definition.defaultValue && valueFromAST(definition.defaultValue, type);
  if (defaultValue !== undefined && defaultValue !== null && defaultValue !== false) {
    field.default = `{{ ${JSON.stringify(defaultValue)} }}`;
  }
  return field;
}

function toFieldType(namedType: ReturnType<typeof getNamedType> | undefined): FormFieldType {
  if (isEnumType(namedType)) return "select";
  return namedType && NUMBER_TYPES.includes(namedType.name) ? "number" : "text";
}

function toLabel(name: string) {
  const words = name.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}
