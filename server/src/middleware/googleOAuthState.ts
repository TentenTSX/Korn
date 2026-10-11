import { randomBytes } from "node:crypto";
import type { Request, Response } from "express";
import { readCookie } from "./cookies";

const cookieName = "google_oauth_state";
const stateCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 10 * 60 * 1000,
};

export function createOAuthState(res: Response) {
  const state = randomBytes(32).toString("hex");
  res.cookie(cookieName, state, stateCookieOptions);
  return state;
}

export function verifyOAuthState(req: Request, res: Response, state: unknown) {
  const expected = readCookie(req, cookieName);
  res.clearCookie(cookieName, stateCookieOptions);
  return typeof state === "string" && expected !== null && state === expected;
}
