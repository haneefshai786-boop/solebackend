// controllers/adminController.js
import Admin from "../models/Admin.js";
import Folder from "../models/Folder.js";
import Vendor from "../models/Vendor.js";
import Category from "../models/Category.js";
import Subcategory from "../models/Subcategory.js";
import Product from "../models/Product.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ------------------- Admin Auth ------------------- */
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, password: hashed });
    res.status(201).json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ ...admin._doc, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ------------------- Folder CRUD ------------------- */
export const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find();
    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createFolder = async (req, res) => {
  try {
    const folder = await Folder.create(req.body);
    res.status(201).json(folder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateFolder = async (req, res) => {
  try {
    const folder = await Folder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(folder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteFolder = async (req, res) => {
  try {
    await Folder.findByIdAndDelete(req.params.id);
    res.json({ message: "Folder deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ------------------- Vendor CRUD ------------------- */
export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate("folder", "name");
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createVendor = async (req, res) => {
  try {
    const { name, folder } = req.body;
    if (!name || !folder) return res.status(400).json({ message: "Missing required fields" });

    const vendor = await Vendor.create({ name, folder });
    const populatedVendor = await Vendor.findById(vendor._id).populate("folder", "name");
    res.status(201).json(populatedVendor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("folder", "name");
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteVendor = async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ message: "Vendor deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ------------------- Category CRUD ------------------- */
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate({
        path: "vendor",
        select: "name folder",
        populate: { path: "folder", select: "name" }
      });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, vendor, folder } = req.body;
    if (!name || !vendor || !folder) return res.status(400).json({ message: "Missing required fields" });

    const category = await Category.create({ name, vendor, folder });
    const populatedCategory = await Category.findById(category._id)
      .populate({
        path: "vendor",
        select: "name folder",
        populate: { path: "folder", select: "name" }
      });
    res.status(201).json(populatedCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate({
        path: "vendor",
        select: "name folder",
        populate: { path: "folder", select: "name" }
      });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ------------------- Subcategory CRUD ------------------- */
export const getSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find()
      .populate({
        path: "category",
        select: "name vendor folder",
        populate: [
          { path: "vendor", select: "name folder", populate: { path: "folder", select: "name" } },
          { path: "folder", select: "name" }
        ]
      })
      .populate({
        path: "vendor",
        select: "name folder",
        populate: { path: "folder", select: "name" }
      })
      .populate("folder", "name");

    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createSubcategory = async (req, res) => {
  try {
    const { name, category, vendor, folder } = req.body;
    if (!name || !category || !vendor || !folder) return res.status(400).json({ message: "Missing required fields" });

    const subcategory = await Subcategory.create({ name, category, vendor, folder });
    const populatedSubcategory = await Subcategory.findById(subcategory._id)
      .populate({
        path: "category",
        select: "name vendor folder",
        populate: [
          { path: "vendor", select: "name folder", populate: { path: "folder", select: "name" } },
          { path: "folder", select: "name" }
        ]
      })
      .populate({
        path: "vendor",
        select: "name folder",
        populate: { path: "folder", select: "name" }
      })
      .populate("folder", "name");

    res.status(201).json(populatedSubcategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate({
        path: "category",
        select: "name vendor folder",
        populate: [
          { path: "vendor", select: "name folder", populate: { path: "folder", select: "name" } },
          { path: "folder", select: "name" }
        ]
      })
      .populate({
        path: "vendor",
        select: "name folder",
        populate: { path: "folder", select: "name" }
      })
      .populate("folder", "name");

    res.json(subcategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteSubcategory = async (req, res) => {
  try {
    await Subcategory.findByIdAndDelete(req.params.id);
    res.json({ message: "Subcategory deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ------------------- Product CRUD ------------------- */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate({
        path: "vendor",
        select: "name folder",
        populate: { path: "folder", select: "name" }
      })
      .populate("folder", "name")
      .populate("category", "name")
      .populate("subcategory", "name");

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, stock, image, description, folder, vendor, category, subcategory, variants } = req.body;

    if (!name || !folder || !vendor || !category || !subcategory) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = await Product.create({
      name,
      price: price || 0,
      stock: stock || 0,
      image,
      description,
      folder,
      vendor,
      category,
      subcategory,
      variants: variants || []
    });

    const populatedProduct = await Product.findById(product._id)
      .populate({ path: "vendor", populate: { path: "folder", select: "name" } })
      .populate("folder", "name")
      .populate("category", "name")
      .populate("subcategory", "name");

    res.status(201).json(populatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate({ path: "vendor", populate: { path: "folder", select: "name" } })
      .populate("folder", "name")
      .populate("category", "name")
      .populate("subcategory", "name");

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

import UserOrder from "../models/UserOrder.js";

/* ------------------- Orders ------------------- */

// Get all orders (admin)
export const getOrders = async (req, res) => {
  try {
    const orders = await UserOrder.find()
      .populate("user", "name email")
      .populate(
        "products.product",
        "name price image vendor category subcategory"
      )
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};

// Get single order by ID (admin)
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await UserOrder.findById(id)
      .populate("user", "name email")
      .populate(
        "products.product",
        "name price image vendor category subcategory"
      );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Get Order By ID Error:", err);
    res.status(500).json({ message: "Server error fetching order" });
  }
};

// ✅ Update order status / payment status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "OutForDelivery",
      "Delivered",
      "Cancelled",
    ];

    const allowedPaymentStatuses = ["Pending", "Paid"];

    const update = {};

    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`,
        });
      }
      update.status = status;
    }

    if (paymentStatus) {
      if (!allowedPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          message: `Invalid payment status. Allowed: ${allowedPaymentStatuses.join(
            ", "
          )}`,
        });
      }
      update.paymentStatus = paymentStatus;
    }

    const order = await UserOrder.findByIdAndUpdate(
      id,
      { $set: update },
      {
        new: true,
        runValidators: false, // 🔥 VERY IMPORTANT
      }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order updated successfully", order });
  } catch (err) {
    console.error("Update Order Status Error:", err);
    res.status(500).json({ message: "Server error updating order" });
  }
};

// Delete order (admin)
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await UserOrder.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Delete Order Error:", err);
    res.status(500).json({ message: "Server error deleting order" });
  }
};
