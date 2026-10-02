import express from "express";
import authenticate, { authenticateOptional } from "../middleware/authenticate";
import cartActions from "../modules/cart/cartActions";
import {
  currentCartOwner,
  currentUserCartOwner,
  runAction,
} from "./routeHelpers";

const router = express.Router();

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

export default router;
