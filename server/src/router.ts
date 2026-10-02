import express from "express";
import authRoutes from "./routes/authRoutes";
import cartRoutes from "./routes/cartRoutes";
import newsletterRoutes from "./routes/newsletterRoutes";
import orderRoutes from "./routes/orderRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import productRoutes from "./routes/productRoutes";
import salePeriodRoutes from "./routes/salePeriodRoutes";

const router = express.Router();

router.use(authRoutes);
router.use(productRoutes);
router.use(cartRoutes);
router.use(orderRoutes);
router.use(paymentRoutes);
router.use(newsletterRoutes);
router.use(salePeriodRoutes);

export default router;
