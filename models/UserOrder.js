import mongoose from "mongoose";

const userOrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number
    }
  ],
  status: { type: String, default: "cart" }
});

export default mongoose.model("UserOrder", userOrderSchema);
