// models/Vendor.js
import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});

export default mongoose.model("Vendor", vendorSchema);
