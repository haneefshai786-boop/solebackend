import express from "express";
import { createVendor, getVendorsByFolder } from "../controllers/vendorController.js";

const router = express.Router();

router.post("/", createVendor);
router.get("/folder/:folderId", getVendorsByFolder);

export default router;
