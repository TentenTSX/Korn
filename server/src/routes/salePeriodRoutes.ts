import express from "express";
import salePeriodActions from "../modules/salePeriod/salePeriodActions";
import { runAction } from "./routeHelpers";

const router = express.Router();

router.get(
  "/api/sales/active",
  runAction(async (_req, res) => {
    res.json((await salePeriodActions.getActiveSalePeriodAction()) ?? null);
  }),
);

export default router;
