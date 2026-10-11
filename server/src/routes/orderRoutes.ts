import express from "express";
import authenticate from "../middleware/authenticate";
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
