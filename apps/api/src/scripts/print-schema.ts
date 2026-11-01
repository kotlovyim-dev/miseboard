import { writeFileSync } from "node:fs";
import { lexicographicSortSchema, printSchema } from "graphql";
import { schema } from "../schema";

const outputPath = new URL("../../../../packages/schema/schema.graphql", import.meta.url);

writeFileSync(outputPath, `${printSchema(lexicographicSortSchema(schema))}\n`);
