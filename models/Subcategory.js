import mongoose from "mongoose";

const SubcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", required: true }
});

export default mongoose.model("Subcategory", SubcategorySchema);
