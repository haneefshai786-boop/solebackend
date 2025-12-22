import express from "express";
import { createAdmin, loginAdmin } from "../controllers/adminController.js";

const router = express.Router();

// Create first admin
router.post("/create", createAdmin);

// Login admin
router.post("/login", loginAdmin);

export default router;
