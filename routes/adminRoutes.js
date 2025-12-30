// routes/adminRoutes.js
import express from "express";
import {
  createAdmin,
  loginAdmin,
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/adminController.js";

import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

/* ------------------- Admin Auth ------------------- */
router.post("/register", createAdmin);
router.post("/login", loginAdmin);

/* ------------------- Folder ------------------- */
router.get("/folders", adminAuth, getFolders);
router.post("/folders", adminAuth, createFolder);
router.put("/folders/:id", adminAuth, updateFolder);
router.delete("/folders/:id", adminAuth, deleteFolder);

/* ------------------- Vendor ------------------- */
router.get("/vendors", adminAuth, getVendors);
router.post("/vendors", adminAuth, createVendor);
router.put("/vendors/:id", adminAuth, updateVendor);
router.delete("/vendors/:id", adminAuth, deleteVendor);

/* ------------------- Category ------------------- */
router.get("/categories", adminAuth, getCategories);
router.post("/categories", adminAuth, createCategory);
router.put("/categories/:id", adminAuth, updateCategory);
router.delete("/categories/:id", adminAuth, deleteCategory);

/* ------------------- Subcategory ------------------- */
router.get("/subcategories", adminAuth, getSubcategories);
router.post("/subcategories", adminAuth, createSubcategory);
router.put("/subcategories/:id", adminAuth, updateSubcategory);
router.delete("/subcategories/:id", adminAuth, deleteSubcategory);

/* ------------------- Product ------------------- */
router.get("/products", adminAuth, getProducts);
router.post("/products", adminAuth, createProduct);
router.put("/products/:id", adminAuth, updateProduct);
router.delete("/products/:id", adminAuth, deleteProduct);

/* ------------------- Orders ------------------- */
router.get("/orders", adminAuth, getOrders);               // Get all orders
router.get("/orders/:id", adminAuth, getOrderById);       // Get single order by ID
router.put("/orders/:id", adminAuth, updateOrderStatus);  // Update order status/payment
router.delete("/orders/:id", adminAuth, deleteOrder);     // Delete an order

export default router;
