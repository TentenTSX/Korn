import express from "express";
import authenticate from "../middleware/authenticate";
import ActionError from "../modules/ActionError";
import invoiceActions from "../modules/invoice/invoiceActions";
import orderActions from "../modules/order/orderActions";
import stripeActions from "../modules/payment/stripeActions";
import { currentUserCartOwner, currentUserId, runAction } from "./routeHelpers";

const router = express.Router();

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

export default router;
