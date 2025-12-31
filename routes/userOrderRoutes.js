import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createOrder, getOrders, confirmCODPayment } from "../controllers/userOrderController.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, getOrders);
router.post("/confirm-cod/:orderId", protect, confirmCODPayment);

export default router;
