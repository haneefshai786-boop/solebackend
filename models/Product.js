import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: String,
    description: String,
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
