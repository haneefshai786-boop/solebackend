import Product from "../models/Product.js";

// GET all products or by subcategory
export const getProducts = async (req, res) => {
  try {
    const { subCategory } = req.query;

    // Build query
    let query = {};
    if (subCategory) query.subcategory = subCategory;

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
    res.status(500).json({ message: err.message });
  }
};

// CREATE new product
export const createProduct = async (req, res) => {
  const { name, price, vendor, category, subcategory, image, description } = req.body;

  // Validate required fields
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

    // Populate the response to include vendor → folder and subcategory → category
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
