import express from "express";
import {
  createPayment,
  getPayments,
  updatePaymentStatus,
  deletePayment,
} from "../controllers/paymentController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Create a payment
router.post("/", createPayment);

// Get all payments (admin only)
router.get("/", adminAuth, getPayments);

// Update payment status (admin only)
router.put("/:id", adminAuth, updatePaymentStatus);

// Delete payment (admin only)
router.delete("/:id", adminAuth, deletePayment);

export default router;
