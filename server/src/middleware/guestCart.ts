import { createHash, randomBytes } from "node:crypto";
import type { Request, Response } from "express";
import { readCookie } from "./cookies";

const cookieName = "guest_cart_token";
const guestCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

export function hashGuestCartToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getExistingGuestCartTokenHash(req: Request) {
  const token = readCookie(req, cookieName);
  return token && /^[a-f0-9]{64}$/i.test(token)
    ? hashGuestCartToken(token)
    : null;
}

export function getOrCreateGuestCartTokenHash(req: Request, res: Response) {
  const existingHash = getExistingGuestCartTokenHash(req);
  if (existingHash) return existingHash;

  const token = randomBytes(32).toString("hex");
  res.cookie(cookieName, token, guestCookieOptions);
  return hashGuestCartToken(token);
}

export function clearGuestCartCookie(res: Response) {
  res.clearCookie(cookieName, guestCookieOptions);
}
