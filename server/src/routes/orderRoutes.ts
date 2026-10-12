import express from "express";
import authenticate, { requireAdmin } from "../middleware/authenticate";
import ActionError from "../modules/ActionError";
import invoiceActions from "../modules/invoice/invoiceActions";
import orderActions from "../modules/order/orderActions";
import { currentUserId, runAction } from "./routeHelpers";

const router = express.Router();

router.get(
  "/api/shipping-fee",
  runAction(async (_req, res) => {
    res.json(orderActions.getShippingFeeAction());
  }),
);

router.get(
  "/api/admin/orders",
  authenticate,
  requireAdmin,
  runAction(async (_req, res) => {
    res.json(await orderActions.getAdminOrdersAction());
  }),
);

router.get(
  "/api/admin/orders/:orderId",
  authenticate,
  requireAdmin,
  runAction(async (req, res) => {
    res.json(
      await orderActions.getAdminOrderAction(Number(req.params.orderId)),
    );
  }),
);

router.patch(
  "/api/admin/orders/:orderId/status",
  authenticate,
  requireAdmin,
  runAction(async (req, res) => {
    await orderActions.updateOrderStatusAction(
      Number(req.params.orderId),
      req.body?.status,
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

export default router;
