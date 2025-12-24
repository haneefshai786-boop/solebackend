import mongoose from "mongoose";
import dotenv from "dotenv";

import Folder from "./models/Folder.js";
import Vendor from "./models/Vendor.js";
import Category from "./models/Category.js";
import Subcategory from "./models/Subcategory.js";
import Product from "./models/Product.js";
import Admin from "./models/Admin.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const seed = async () => {
  try {
    console.log("=== Clearing old data ===");
    await Folder.deleteMany({});
    await Vendor.deleteMany({});
    await Category.deleteMany({});
    await Subcategory.deleteMany({});
    await Product.deleteMany({});
    await Admin.deleteMany({});

    console.log("=== Creating Admin ===");
    const admin = new Admin({
      name: "Super Admin",
      email: "admin@example.com",
      password: "Admin@123"
    });
    await admin.save();
    console.log("Admin created:", admin.email);

    console.log("=== Creating Folders ===");
    const folders = await Folder.insertMany([
      { name: "Restaurant" },
      { name: "Grocery" },
      { name: "Pharmacy" }
    ]);

    console.log(folders);

    console.log("=== Creating Vendors ===");
    const vendors = await Vendor.insertMany([
      { name: "Tasty Bites", folder: folders[0]._id },
      { name: "Fresh Mart", folder: folders[1]._id },
      { name: "HealthPlus", folder: folders[2]._id }
    ]);

    console.log(vendors);

    console.log("=== Creating Categories ===");
    const categories = await Category.insertMany([
      { name: "Indian", folder: folders[0]._id, vendor: vendors[0]._id },
      { name: "Vegetables", folder: folders[1]._id, vendor: vendors[1]._id },
      { name: "Medicine", folder: folders[2]._id, vendor: vendors[2]._id }
    ]);

    console.log(categories);

    console.log("=== Creating Subcategories ===");
    const subcategories = await Subcategory.insertMany([
      { name: "Veg", folder: folders[0]._id, vendor: vendors[0]._id, category: categories[0]._id },
      { name: "Fruits", folder: folders[1]._id, vendor: vendors[1]._id, category: categories[1]._id },
      { name: "Painkillers", folder: folders[2]._id, vendor: vendors[2]._id, category: categories[2]._id }
    ]);

    console.log(subcategories);

    console.log("=== Creating Products ===");
    const products = await Product.insertMany([
      { 
        name: "Veg Biryani",
        price: 180,
        image: "https://example.com/biryani.jpg",
        description: "Delicious Veg Biryani",
        folder: folders[0]._id,
        vendor: vendors[0]._id,
        category: categories[0]._id,
        subcategory: subcategories[0]._id
      },
      {
        name: "Fresh Apple",
        price: 50,
        image: "https://example.com/apple.jpg",
        description: "Juicy Red Apple",
        folder: folders[1]._id,
        vendor: vendors[1]._id,
        category: categories[1]._id,
        subcategory: subcategories[1]._id
      },
      {
        name: "Paracetamol",
        price: 20,
        image: "https://example.com/paracetamol.jpg",
        description: "Pain relief tablets",
        folder: folders[2]._id,
        vendor: vendors[2]._id,
        category: categories[2]._id,
        subcategory: subcategories[2]._id
      }
    ]);

    console.log(products);

    console.log("=== All data seeded successfully! ===");
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
