// routes/adminRoutes.js
import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  loginAdmin,
  createAdmin,
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
  deleteOrder
} from "../controllers/adminController.js";

const router = express.Router();

// Admin login & create
router.post("/create", createAdmin);
router.post("/login", loginAdmin);

// All admin routes below are protected
router.use(adminAuth);

// Folder routes
router.get("/folders", getFolders);
router.post("/folders", createFolder);
router.put("/folders/:id", updateFolder);
router.delete("/folders/:id", deleteFolder);

// Vendor routes
router.get("/vendors", getVendors);
router.post("/vendors", createVendor);
router.put("/vendors/:id", updateVendor);
router.delete("/vendors/:id", deleteVendor);

// Category routes
router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Subcategory routes
router.get("/subcategories", getSubcategories);
router.post("/subcategories", createSubcategory);
router.put("/subcategories/:id", updateSubcategory);
router.delete("/subcategories/:id", deleteSubcategory);

// Product routes
router.get("/products", getProducts);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Orders (ADDED – admin control)
router.get("/orders", getOrders);
router.get("/orders/:id", getOrderById);
router.put("/orders/:id", updateOrderStatus);
router.delete("/orders/:id", deleteOrder);

export default router;
