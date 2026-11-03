import { createHmac, timingSafeEqual } from "node:crypto";
import { DEFAULT_ROLE, roles } from "./roles";
import type { Role } from "./roles";

export const ROLE_COOKIE_NAME = "miseboard_role";

export interface RoleCookieConfig {
  secret: string;
  isSecure: boolean;
}

export function signRole(role: Role, secret: string) {
  return `${role}.${computeSignature(role, secret)}`;
}

export function verifyRole(token: string, secret: string): Role | undefined {
  const [role, signature] = token.split(".");
  if (!isRole(role) || !signature) return undefined;
  const expected = Buffer.from(computeSignature(role, secret));
  const actual = Buffer.from(signature);
  return actual.length === expected.length && timingSafeEqual(actual, expected) ? role : undefined;
}

export function readRoleCookie(cookieHeader: string | null, secret: string): Role {
  const token = findCookieValue(cookieHeader, ROLE_COOKIE_NAME);
  return (token && verifyRole(token, secret)) || DEFAULT_ROLE;
}

export function buildRoleCookie(role: Role, { secret, isSecure }: RoleCookieConfig) {
  return {
    name: ROLE_COOKIE_NAME,
    value: signRole(role, secret),
    path: "/",
    domain: null,
    expires: null,
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
  } as const;
}

function computeSignature(role: Role, secret: string) {
  return createHmac("sha256", secret).update(role).digest("hex");
}

function isRole(value: string | undefined): value is Role {
  return roles.some((role) => role === value);
}

function findCookieValue(cookieHeader: string | null, name: string) {
  const prefix = `${name}=`;
  const pair = cookieHeader?.split(";").find((part) => part.trim().startsWith(prefix));
  return pair?.trim().slice(prefix.length);
}
