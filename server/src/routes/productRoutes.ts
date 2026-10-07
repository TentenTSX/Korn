import express from "express";
import productActions from "../modules/product/productActions";
import { runAction } from "./routeHelpers";

const router = express.Router();

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
        sort: typeof req.query.sort === "string" ? req.query.sort : undefined,
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

export default router;
