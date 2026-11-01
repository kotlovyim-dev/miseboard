export const BINARY_PRECEDENCE: Readonly<Record<string, number>> = {
  "??": 1,
  "||": 1,
  "&&": 2,
  "==": 6,
  "!=": 6,
  "===": 6,
  "!==": 6,
  "<": 7,
  "<=": 7,
  ">": 7,
  ">=": 7,
  "+": 9,
  "-": 9,
  "*": 10,
  "/": 10,
  "%": 10,
};

export const UNARY_OPERATORS: readonly string[] = ["!", "-"];
