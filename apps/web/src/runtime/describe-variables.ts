export function describeVariables(variables: Record<string, unknown>) {
  return Object.entries(variables)
    .map(([name, value]) => `${name} = ${String(value)}`)
    .join(", ");
}
