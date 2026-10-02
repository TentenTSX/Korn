import express from "express";
import authenticate, { authenticateOptional } from "../middleware/authenticate";
import paymentActions from "../modules/payment/paymentActions";
import stripeActions from "../modules/payment/stripeActions";
import { currentCartOwner, currentUserId, runAction } from "./routeHelpers";

const router = express.Router();

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
