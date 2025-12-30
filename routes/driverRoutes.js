import express from "express";
import {
  registerDriver,
  loginDriver,
  updateDriverLocation,
  getDriverOrders,
  updateOrderStatus
} from "../controllers/driverController.js";
import driverAuth from "../middleware/driverAuth.js";

const router = express.Router();

router.post("/register", registerDriver);
router.post("/login", loginDriver);

router.post("/update-location", driverAuth, updateDriverLocation);
router.get("/orders", driverAuth, getDriverOrders);

/* ✅ THIS MUST EXIST */
router.post("/update-order-status", driverAuth, updateOrderStatus);

export default router;
