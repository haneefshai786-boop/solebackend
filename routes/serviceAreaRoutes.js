import express from "express";
import {
  createServiceArea,
  getServiceAreas,
  updateServiceArea,
  deleteServiceArea,
  checkServiceArea,        // ✅ ADD THIS
} from "../controllers/serviceAreaController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

/* ---------------- PUBLIC ROUTES ---------------- */

// Anyone can view service areas
router.get("/", getServiceAreas);

// 🔥 Check if location is inside service area
router.post("/check", checkServiceArea);

/* ---------------- ADMIN ROUTES ---------------- */

// Create service area
router.post("/", adminAuth, createServiceArea);

// Update service area
router.put("/:id", adminAuth, updateServiceArea);

// Delete service area
router.delete("/:id", adminAuth, deleteServiceArea);

export default router;
