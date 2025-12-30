// routes/userOrderRoutes.js
import express from "express";
import {
  createOrder,
  getOrders,
  confirmCODPayment,
} from "../controllers/userOrderController.js";
import { protect } from "../middleware/authMiddleware.js"; // ensures user is logged in

const router = express.Router();

// Create a new order (user must be logged in)
router.post("/", protect, createOrder);

// Get all orders for logged-in user
router.get("/", protect, getOrders);

// Confirm COD payment (user/admin)
router.post("/:orderId/confirm-cod", protect, confirmCODPayment);

export default router;
