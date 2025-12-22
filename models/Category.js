import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: String,
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }
});

export default mongoose.model("Category", categorySchema);
