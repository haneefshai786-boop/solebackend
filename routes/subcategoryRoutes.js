// routes/subcategoryRoutes.js
import express from "express";
import { createSubcategory, getSubcategories } from "../controllers/subcategoryController.js";

const router = express.Router();

router.post("/", createSubcategory);       // Create subcategory
router.get("/:categoryId", getSubcategories); // Get subcategories by category

export default router;
