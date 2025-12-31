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

<<<<<<< HEAD
router.get("/profile", driverAuth, (req, res) => {
  res.json({ driver: req.driver });
});

router.post("/update-location", driverAuth, updateDriverLocation);
router.get("/orders", driverAuth, getDriverOrders);
router.post("/update-order-status", driverAuth, updateOrderStatus);
=======
/* =========================
   PROTECTED DRIVER ROUTES
========================= */
router.get("/profile", protectDriver, getDriverProfile);

router.post("/update-location", protectDriver, updateDriverLocation);

router.get("/orders", protectDriver, getDriverOrders);

router.post("/update-order-status", protectDriver, updateOrderStatus);
>>>>>>> 90f2324 (Recent edits: fix driver socket, order flow, enums, and frontend updates)

export default router;
