import Subcategory from "../models/Subcategory.js";
import Category from "../models/Category.js";

export const createSubcategory = async (req, res) => {
  const { name, category } = req.body;
  if (!name || !category) return res.status(400).json({ message: "Subcategory name and category are required" });

  try {
    const c = await Category.findById(category);
    if (!c) return res.status(404).json({ message: "Category not found" });

    const subcategory = await Subcategory.create({ name, category });
    res.status(201).json(subcategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSubcategories = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const subcategories = await Subcategory.find({ category: categoryId });
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
