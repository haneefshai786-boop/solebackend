import express from "express";

// Controllers
import {
  registerDriver,
  loginDriver,
  getDriverProfile,
  updateDriverLocation,
  getDriverOrders,
  updateOrderStatus,
} from "../controllers/driverController.js";

// Middleware
import { protectDriver } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   AUTH ROUTES
========================= */
router.post("/register", registerDriver);
router.post("/login", loginDriver);

/* =========================
   PROTECTED DRIVER ROUTES
========================= */
router.get("/profile", protectDriver, getDriverProfile);
router.post("/update-location", protectDriver, updateDriverLocation);
router.get("/orders", protectDriver, getDriverOrders);
router.post("/update-order-status", protectDriver, updateOrderStatus);

export default router;
