import Folder from "../models/Folder.js";
import Vendor from "../models/Vendor.js";
import Category from "../models/Category.js";
import Subcategory from "../models/Subcategory.js";
import Product from "../models/Product.js";

/* CREATE FOLDER */
export const createFolder = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Folder name is required" });
  }

  try {
    const folder = await Folder.create({ name });
    res.status(201).json(folder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET ALL FOLDERS (BASIC) */
export const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find();
    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET FULL TREE: folder → vendor → category → subcategory → product */
export const getFullHierarchy = async (req, res) => {
  try {
    const folders = await Folder.find().lean();

    for (const folder of folders) {
      folder.vendors = await Vendor.find({ folder: folder._id }).lean();

      for (const vendor of folder.vendors) {
        vendor.categories = await Category.find({ vendor: vendor._id }).lean();

        for (const category of vendor.categories) {
          category.subcategories = await Subcategory.find({
            category: category._id
          }).lean();

          for (const sub of category.subcategories) {
            sub.products = await Product.find({
              subcategory: sub._id
            }).lean();
          }
        }
      }
    }

    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
