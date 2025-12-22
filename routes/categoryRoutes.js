import express from "express";
import { createCategory, getCategoriesByVendor } from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/vendor/:vendorId", getCategoriesByVendor);

export default router;
