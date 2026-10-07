import type { Request, RequestHandler, Response } from "express";
import {
  clearGuestCartCookie,
  getExistingGuestCartTokenHash,
  getOrCreateGuestCartTokenHash,
} from "../middleware/guestCart";
import ActionError from "../modules/ActionError";
import type CartOwner from "../modules/cart/CartOwner";
import cartActions from "../modules/cart/cartActions";

export type RouteAction = (req: Request, res: Response) => Promise<void>;

export function runAction(action: RouteAction): RequestHandler {
  return (req, res, next) => {
    void action(req, res).catch(next);
  };
}

export function currentUserId(req: Request) {
  if (!req.authUser) {
    throw new ActionError("UNAUTHORIZED", "Authentification requise.");
  }
  return req.authUser.id_user;
}

export function currentUserCartOwner(req: Request, requestedUserId: string) {
  const userId = currentUserId(req);
  if (userId !== Number(requestedUserId)) {
    throw new ActionError("FORBIDDEN", "Accès interdit.");
  }
  return { kind: "user" as const, userId };
}

export function currentCartOwner(
  req: Request,
  res: Response,
  createGuestToken: boolean,
): CartOwner {
  if (req.authUser) return { kind: "user", userId: req.authUser.id_user };
  const guestTokenHash = createGuestToken
    ? getOrCreateGuestCartTokenHash(req, res)
    : getExistingGuestCartTokenHash(req);
  if (!guestTokenHash) {
    throw new ActionError("UNAUTHORIZED", "Session de panier requise.");
  }
  return { kind: "guest", guestTokenHash };
}

export async function mergeGuestCart(
  req: Request,
  res: Response,
  userId: number,
  email: string,
) {
  const guestTokenHash = getExistingGuestCartTokenHash(req);
  if (!guestTokenHash) return;
  await cartActions.mergeGuestCartAction(guestTokenHash, userId, email);
  clearGuestCartCookie(res);
}

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
