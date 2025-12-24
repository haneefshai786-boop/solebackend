import mongoose from "mongoose";
import dotenv from "dotenv";
import Folder from "./models/Folder.js";
import Vendor from "./models/Vendor.js";
import Category from "./models/Category.js";
import Subcategory from "./models/Subcategory.js";
import Product from "./models/Product.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

async function listAll() {
  const folders = await Folder.find().lean();
  
  for (const folder of folders) {
    console.log(`Folder: ${folder.name} (_id: ${folder._id})`);

    const vendors = await Vendor.find({ folder: folder._id }).lean();
    for (const vendor of vendors) {
      console.log(`  Vendor: ${vendor.name} (_id: ${vendor._id})`);

      const categories = await Category.find({ vendor: vendor._id }).lean();
      for (const category of categories) {
        console.log(`    Category: ${category.name} (_id: ${category._id})`);

        const subcategories = await Subcategory.find({ category: category._id }).lean();
        for (const sub of subcategories) {
          console.log(`      Subcategory: ${sub.name} (_id: ${sub._id})`);

          const products = await Product.find({ subcategory: sub._id }).lean();
          for (const product of products) {
            console.log(`        Product: ${product.name} (_id: ${product._id}, price: ${product.price})`);
          }
        }
      }
    }
  }

  mongoose.disconnect();
}

listAll();
