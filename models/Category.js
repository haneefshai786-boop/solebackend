import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", required: true }
});

export default mongoose.model("Category", CategorySchema);
