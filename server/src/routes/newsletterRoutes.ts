import express from "express";
import newsletterActions from "../modules/newsletter/newsletterActions";
import { runAction } from "./routeHelpers";

const router = express.Router();

router.post(
  "/api/newsletter/subscribe",
  runAction(async (req, res) => {
    await newsletterActions.subscribeAction(req.body?.email);
    res.sendStatus(204);
  }),
);

export default router;
