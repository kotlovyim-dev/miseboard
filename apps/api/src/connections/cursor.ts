import { z } from "zod";
import { badInput } from "../errors";

export interface OrderCursor {
  createdAt: Date;
  id: string;
}

const SEPARATOR = "|";

export function encodeCursor({ createdAt, id }: OrderCursor) {
  return Buffer.from(`${createdAt.toISOString()}${SEPARATOR}${id}`).toString("base64url");
}

export function decodeCursor(cursor: string): OrderCursor {
  const [timestamp, rawId, ...rest] = Buffer.from(cursor, "base64url").toString().split(SEPARATOR);
  const createdAt = new Date(timestamp ?? "");
  const id = z.uuid().safeParse(rawId);
  if (rest.length > 0 || Number.isNaN(createdAt.getTime()) || !id.success) {
    throw badInput("Invalid cursor");
  }
  return { createdAt, id: id.data };
}
