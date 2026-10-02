import express, {
  type Request,
  type RequestHandler,
  type Response,
} from "express";
import authenticate, { authenticateOptional } from "./middleware/authenticate";
import {
  clearGuestCartCookie,
  getExistingGuestCartTokenHash,
  getOrCreateGuestCartTokenHash,
} from "./middleware/guestCart";
import ActionError from "./modules/ActionError";
import authActions from "./modules/auth/authActions";
import type CartOwner from "./modules/cart/CartOwner";
import cartActions from "./modules/cart/cartActions";
import invoiceActions from "./modules/invoice/invoiceActions";
import newsletterActions from "./modules/newsletter/newsletterActions";
import orderActions from "./modules/order/orderActions";
import paymentActions from "./modules/payment/paymentActions";
import stripeActions from "./modules/payment/stripeActions";
import productActions from "./modules/product/productActions";

const router = express.Router();
type RouteAction = (req: Request, res: Response) => Promise<void>;

function runAction(action: RouteAction): RequestHandler {
  return (req, res, next) => {
    void action(req, res).catch(next);
  };
}

function currentUserId(req: Request) {
  if (!req.authUser) {
    throw new ActionError("UNAUTHORIZED", "Authentification requise.");
  }
  return req.authUser.id_user;
}

function currentUserCartOwner(req: Request, requestedUserId: string) {
  const userId = currentUserId(req);
  if (userId !== Number(requestedUserId)) {
    throw new ActionError("FORBIDDEN", "Accès interdit.");
  }
  return { kind: "user" as const, userId };
}

function currentCartOwner(
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

async function mergeGuestCart(req: Request, res: Response, userId: number) {
  const guestTokenHash = getExistingGuestCartTokenHash(req);
  if (!guestTokenHash) return;
  await cartActions.mergeGuestCartAction(guestTokenHash, userId);
  clearGuestCartCookie(res);
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

router.post(
  "/api/auth/register",
  runAction(async (req, res) => {
    const result = await authActions.register(req.body);
    await mergeGuestCart(req, res, result.user.id_user);
    res.cookie("auth_token", result.token, cookieOptions);
    res.status(201).json({ user: result.user });
  }),
);

router.post(
  "/api/auth/login",
  runAction(async (req, res) => {
    const result = await authActions.login(req.body);
    await mergeGuestCart(req, res, result.user.id_user);
    res.cookie("auth_token", result.token, cookieOptions);
    res.status(200).json({ user: result.user });
  }),
);

router.post(
  "/api/auth/logout",
  runAction(async (_req, res) => {
    await authActions.logout();
    res.clearCookie("auth_token", cookieOptions).sendStatus(204);
  }),
);

router.get(
  "/api/auth/me",
  authenticate,
  runAction(async (req, res) => {
    res.json(await authActions.getCurrentUser(currentUserId(req)));
  }),
);

router.get(
  "/api/users/:id",
  authenticate,
  runAction(async (req, res) => {
    res.json(
      await authActions.getProfile(currentUserId(req), Number(req.params.id)),
    );
  }),
);

router.get(
  "/api/products",
  runAction(async (req, res) => {
    res.json(
      await productActions.getProductsAction({
        category:
          typeof req.query.category === "string"
            ? req.query.category
            : undefined,
        gender:
          typeof req.query.gender === "string" ? req.query.gender : undefined,
        search:
          typeof req.query.search === "string" ? req.query.search : undefined,
      }),
    );
  }),
);

router.get(
  "/api/products/:id",
  runAction(async (req, res) => {
    res.json(await productActions.getProductAction(Number(req.params.id)));
  }),
);

router.get(
  "/api/categories",
  runAction(async (_req, res) => {
    res.json(await productActions.getCategoriesAction());
  }),
);

router.post(
  "/api/newsletter/subscribe",
  runAction(async (req, res) => {
    await newsletterActions.subscribeAction(req.body?.email);
    res.sendStatus(204);
  }),
);

router.get(
  "/api/cart",
  authenticateOptional,
  runAction(async (req, res) => {
    res.json(await cartActions.getCartAction(currentCartOwner(req, res, true)));
  }),
);

router.post(
  "/api/cart/items",
  authenticateOptional,
  runAction(async (req, res) => {
    await cartActions.addCartItemAction(
      currentCartOwner(req, res, true),
      req.body,
    );
    res.sendStatus(204);
  }),
);

router.patch(
  "/api/cart/items/:itemId",
  authenticateOptional,
  runAction(async (req, res) => {
    await cartActions.updateCartItemAction(
      currentCartOwner(req, res, false),
      Number(req.params.itemId),
      req.body?.quantity,
    );
    res.sendStatus(204);
  }),
);

router.delete(
  "/api/cart/items/:itemId",
  authenticateOptional,
  runAction(async (req, res) => {
    await cartActions.deleteCartItemAction(
      currentCartOwner(req, res, false),
      Number(req.params.itemId),
    );
    res.sendStatus(204);
  }),
);

router.post(
  "/api/cart/checkout",
  authenticateOptional,
  runAction(async (req, res) => {
    const checkout = await stripeActions.createCheckoutSessionAction(
      currentCartOwner(req, res, false),
      req.body,
    );
    res.status(201).json(checkout);
  }),
);

router.get(
  "/api/payments/stripe/session",
  authenticateOptional,
  runAction(async (req, res) => {
    const sessionId =
      typeof req.query.session_id === "string" ? req.query.session_id : "";
    res.json(
      await stripeActions.getCheckoutSessionAction(
        currentCartOwner(req, res, false),
        sessionId,
      ),
    );
  }),
);

router.post(
  "/api/payments/stripe/webhook",
  runAction(async (req, res) => {
    await stripeActions.handleStripeWebhookAction(
      Buffer.isBuffer(req.body) ? req.body : undefined,
      req.header("stripe-signature"),
    );
    res.sendStatus(200);
  }),
);

router.get(
  "/api/users/:userId/cart",
  authenticate,
  runAction(async (req, res) => {
    res.json(
      await cartActions.getCartAction(
        currentUserCartOwner(req, req.params.userId),
      ),
    );
  }),
);

router.post(
  "/api/users/:userId/cart/items",
  authenticate,
  runAction(async (req, res) => {
    await cartActions.addCartItemAction(
      currentUserCartOwner(req, req.params.userId),
      req.body,
    );
    res.sendStatus(204);
  }),
);

router.patch(
  "/api/users/:userId/cart/items/:itemId",
  authenticate,
  runAction(async (req, res) => {
    await cartActions.updateCartItemAction(
      currentUserCartOwner(req, req.params.userId),
      Number(req.params.itemId),
      req.body?.quantity,
    );
    res.sendStatus(204);
  }),
);

router.delete(
  "/api/users/:userId/cart/items/:itemId",
  authenticate,
  runAction(async (req, res) => {
    await cartActions.deleteCartItemAction(
      currentUserCartOwner(req, req.params.userId),
      Number(req.params.itemId),
    );
    res.sendStatus(204);
  }),
);

router.get(
  "/api/users/:userId/orders",
  authenticate,
  runAction(async (req, res) => {
    res.json(
      await orderActions.getOrdersAction(
        Number(req.params.userId),
        currentUserId(req),
      ),
    );
  }),
);

router.get(
  "/api/users/:userId/orders/:orderId",
  authenticate,
  runAction(async (req, res) => {
    res.json(
      await orderActions.getOrderAction(
        Number(req.params.userId),
        currentUserId(req),
        Number(req.params.orderId),
      ),
    );
  }),
);

router.get(
  "/api/users/:userId/orders/:orderId/invoice",
  authenticate,
  runAction(async (req, res) => {
    const ownerId = currentUserId(req);
    if (ownerId !== Number(req.params.userId)) {
      throw new ActionError("FORBIDDEN", "Accès interdit.");
    }
    const invoice = await invoiceActions.getInvoiceAction(
      ownerId,
      Number(req.params.orderId),
    );
    res
      .type("application/pdf")
      .set(
        "Content-Disposition",
        `attachment; filename="${invoice.invoiceNumber}.pdf"`,
      )
      .send(invoice.pdf);
  }),
);

router.post(
  "/api/users/:userId/orders",
  authenticate,
  runAction(async (req, res) => {
    const owner = currentUserCartOwner(req, req.params.userId);
    const checkout = await stripeActions.createCheckoutSessionAction(
      owner,
      req.body,
    );
    res.status(201).json(checkout);
  }),
);

router.patch(
  "/api/users/:userId/orders/:orderId/status",
  authenticate,
  runAction(async (req, res) => {
    await orderActions.updateOrderStatusAction(
      Number(req.params.userId),
      currentUserId(req),
      Number(req.params.orderId),
      req.body?.status,
    );
    res.sendStatus(204);
  }),
);

router.get(
  "/api/orders/:orderId/payments",
  authenticate,
  runAction(async (req, res) => {
    res.json(
      await paymentActions.getPaymentsAction(
        currentUserId(req),
        Number(req.params.orderId),
      ),
    );
  }),
);

router.post(
  "/api/orders/:orderId/payments",
  authenticate,
  runAction(async (req, res) => {
    const paymentId = await paymentActions.createPaymentAction(
      currentUserId(req),
      Number(req.params.orderId),
      req.body,
    );
    res.status(201).json({ paymentId });
  }),
);

export default router;
