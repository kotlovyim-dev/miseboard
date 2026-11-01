import { readFileSync } from "node:fs";

const TYPES = ["feat", "fix", "refactor", "test", "chore", "ci", "build", "docs", "style", "perf"];
const SCOPES = [
  "engine",
  "config",
  "db",
  "api",
  "web",
  "editor",
  "runtime",
  "widgets",
  "queries",
  "infra",
  "ci",
];
const MAX_HEADER_LENGTH = 72;

const HEADER_PATTERN = new RegExp(
  String.raw`^(${TYPES.join("|")})(\((${SCOPES.join("|")})\))?: [^\s].*[^.\s]$`,
);

const header = readHeader(process.argv[2]);

if (header.startsWith("Merge ") || isValidHeader(header)) {
  process.exit(0);
}

console.error(`Invalid commit message: "${header}"`);
console.error(`Expected: <type>(<scope>): <subject>, at most ${MAX_HEADER_LENGTH} characters.`);
console.error(`Types: ${TYPES.join(", ")}`);
console.error(`Scopes: ${SCOPES.join(", ")}`);
process.exit(1);

function readHeader(messagePath) {
  const lines = readFileSync(messagePath, "utf8").split("\n");
  return lines.find((line) => !line.startsWith("#"))?.trim() ?? "";
}

function isValidHeader(text) {
  return text.length <= MAX_HEADER_LENGTH && HEADER_PATTERN.test(text);
}
