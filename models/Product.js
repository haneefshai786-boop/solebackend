import mongoose from "mongoose";

/* ================= VARIANT SCHEMA ================= */
const variantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // e.g. "Weight"
    },
    value: {
      type: String,
      required: true, // e.g. "1 kg", "500 g"
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
  { _id: true }
);

/* ================= PRODUCT SCHEMA ================= */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    // Used when NO variants
    price: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      default: 0,
    },

    image: String,
    description: String,

    /* ===== RELATIONS ===== */
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },

    /* ===== VARIANTS ===== */
    variants: [variantSchema], // empty array = no variants
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
