// controllers/adminController.js
import Admin from "../models/Admin.js";
import Folder from "../models/Folder.js";
import Vendor from "../models/Vendor.js";
import Category from "../models/Category.js";
import Subcategory from "../models/Subcategory.js";
import Product from "../models/Product.js";
import Order from "../models/UserOrder.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ------------------- Admin Login / Create ------------------- */
export const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, password: hashed });
    res.status(201).json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(400).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match)
      return res.status(400).json({ message: "Invalid password" });

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
  const folders = await Folder.find();
  res.json(folders);
};
export const createFolder = async (req, res) => {
  const folder = await Folder.create(req.body);
  res.status(201).json(folder);
};
export const updateFolder = async (req, res) => {
  const folder = await Folder.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(folder);
};
export const deleteFolder = async (req, res) => {
  await Folder.findByIdAndDelete(req.params.id);
  res.json({ message: "Folder deleted" });
};

/* ------------------- Vendor CRUD ------------------- */
export const getVendors = async (req, res) => {
  const vendors = await Vendor.find().populate("folder");
  res.json(vendors);
};
export const createVendor = async (req, res) => {
  const vendor = await Vendor.create(req.body);
  res.status(201).json(vendor);
};
export const updateVendor = async (req, res) => {
  const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(vendor);
};
export const deleteVendor = async (req, res) => {
  await Vendor.findByIdAndDelete(req.params.id);
  res.json({ message: "Vendor deleted" });
};

/* ------------------- Category CRUD ------------------- */
export const getCategories = async (req, res) => {
  const categories = await Category.find().populate("vendor");
  res.json(categories);
};
export const createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
};
export const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(category);
};
export const deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
};

/* ------------------- Subcategory CRUD ------------------- */
export const getSubcategories = async (req, res) => {
  const subcategories = await Subcategory.find().populate({
    path: "category",
    populate: { path: "vendor" }
  });
  res.json(subcategories);
};
export const createSubcategory = async (req, res) => {
  const subcategory = await Subcategory.create(req.body);
  res.status(201).json(subcategory);
};
export const updateSubcategory = async (req, res) => {
  const subcategory = await Subcategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(subcategory);
};
export const deleteSubcategory = async (req, res) => {
  await Subcategory.findByIdAndDelete(req.params.id);
  res.json({ message: "Subcategory deleted" });
};

/* ------------------- Product CRUD ------------------- */
export const getProducts = async (req, res) => {
  const products = await Product.find()
    .populate("vendor")
    .populate("category")
    .populate("subcategory");
  res.json(products);
};
export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};
export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(product);
};
export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};

/* ------------------- Orders (ADDED ONLY) ------------------- */
export const getOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("products.product")
    .populate("user");
  res.json(orders);
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("products.product")
    .populate("user");

  if (!order)
    return res.status(404).json({ message: "Order not found" });

  res.json(order);
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!order)
    return res.status(404).json({ message: "Order not found" });

  res.json(order);
};

export const deleteOrder = async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: "Order deleted" });
};
