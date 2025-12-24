import express from "express";
import { createOrder, getOrders } from "../controllers/userOrderController.js";
import { protect } from "../middleware/authMiddleware.js"; // middleware to check JWT

const router = express.Router();

// Create a new order
router.post("/", protect, createOrder);

// Get all orders of logged-in user
router.get("/", protect, getOrders);

export default router;
