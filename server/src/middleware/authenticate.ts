import type { RequestHandler } from "express";
import jwtUtil from "../modules/auth/Jwt";

export function readAuthCookie(cookieHeader?: string) {
  const cookie = cookieHeader
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("auth_token="));
  return cookie ? decodeURIComponent(cookie.slice("auth_token=".length)) : null;
}

function attachAuthenticatedUser(
  req: Parameters<RequestHandler>[0],
  token: string,
) {
  const payload = jwtUtil.verifyToken(token);
  if (!Number.isInteger(payload.id_user) || payload.id_user < 1) {
    throw new Error("Invalid authentication token.");
  }
  req.authUser = { id_user: payload.id_user };
}

const authenticate: RequestHandler = (req, res, next) => {
  try {
    const token = readAuthCookie(req.headers.cookie);
    if (!token) {
      res.status(401).json({ message: "Authentification requise." });
      return;
    }

    attachAuthenticatedUser(req, token);
    next();
  } catch {
    res.status(401).json({ message: "Authentification requise." });
  }
};

export const authenticateOptional: RequestHandler = (req, res, next) => {
  try {
    const token = readAuthCookie(req.headers.cookie);
    if (token) attachAuthenticatedUser(req, token);
    next();
  } catch {
    res.status(401).json({ message: "Authentification requise." });
  }
};

export default authenticate;
