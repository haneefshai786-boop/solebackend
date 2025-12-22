import Category from "../models/Category.js";
import Vendor from "../models/Vendor.js";

export const createCategory = async (req, res) => {
  const { name, vendor } = req.body;

  if (!name || !vendor) {
    return res.status(400).json({ message: "name and vendor required" });
  }

  const v = await Vendor.findById(vendor);
  if (!v) return res.status(404).json({ message: "Vendor not found" });

  const category = await Category.create({ name, vendor });
  res.status(201).json(category);
};

export const getCategoriesByVendor = async (req, res) => {
  const { vendorId } = req.params;

  const categories = await Category.find({ vendor: vendorId });
  res.json(categories);
};
