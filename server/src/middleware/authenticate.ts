import type { RequestHandler } from "express";
import jwtUtil from "../modules/auth/Jwt";
import authRepository from "../modules/auth/authRepository";

export function readAuthCookie(cookieHeader?: string) {
  const cookie = cookieHeader
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("auth_token="));
  return cookie ? decodeURIComponent(cookie.slice("auth_token=".length)) : null;
}

async function attachAuthenticatedUser(
  req: Parameters<RequestHandler>[0],
  token: string,
) {
  const payload = jwtUtil.verifyToken(token);
  if (!Number.isInteger(payload.id_user) || payload.id_user < 1) {
    throw new Error("Invalid authentication token.");
  }
  // A syntactically valid token can still reference a deleted account
  // (e.g. a stale cookie after the user was removed): treat that the
  // same as no authentication rather than letting it reach the routes.
  const user = await authRepository.findById(payload.id_user);
  if (!user) {
    throw new Error("Authenticated user no longer exists.");
  }
  req.authUser = { id_user: payload.id_user };
}

const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const token = readAuthCookie(req.headers.cookie);
    if (!token) {
      res.status(401).json({ message: "Authentification requise." });
      return;
    }

    await attachAuthenticatedUser(req, token);
    next();
  } catch {
    res.status(401).json({ message: "Authentification requise." });
  }
};

export const authenticateOptional: RequestHandler = async (req, _res, next) => {
  const token = readAuthCookie(req.headers.cookie);
  if (token) {
    try {
      await attachAuthenticatedUser(req, token);
    } catch {
      // Invalid, expired or stale (deleted account) token: fall back to
      // guest behaviour instead of rejecting the whole request.
    }
  }
  next();
};

export default authenticate;
