import express from "express";
import { createProduct, getProducts } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);         // Fetch all or by subcategory
router.post("/", createProduct);      // Add new product

export default router;
