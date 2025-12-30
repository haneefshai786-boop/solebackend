import Product from "../models/Product.js";

// GET all products / by subcategory / by search
export const getProducts = async (req, res) => {
  try {
    const { subCategory, search } = req.query;

    let query = {};

    // ✅ Subcategory filter
    if (subCategory) {
      query.subcategory = subCategory;
    }

    // ✅ Search filter (IMPORTANT)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query)
      .populate({
        path: "vendor",
        select: "name folder",
        populate: { path: "folder", select: "name" }
      })
      .populate({
        path: "subcategory",
        select: "name category",
        populate: { path: "category", select: "name" }
      });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// CREATE new product (Admin)
export const createProduct = async (req, res) => {
  const { name, price, vendor, category, subcategory, image, description } = req.body;

  if (!name || !price || !vendor || !category || !subcategory) {
    return res.status(400).json({
      message: "All fields are required: name, price, vendor, category, subcategory"
    });
  }

  try {
    const product = await Product.create({
      name,
      price,
      vendor,
      category,
      subcategory,
      image,
      description
    });

    const populatedProduct = await product
      .populate({
        path: "vendor",
        select: "name folder",
        populate: { path: "folder", select: "name" }
      })
      .populate({
        path: "subcategory",
        select: "name category",
        populate: { path: "category", select: "name" }
      });

    res.status(201).json(populatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
