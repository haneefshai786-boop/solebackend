import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  vendors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }], // Add this line
});

export default mongoose.model("Folder", folderSchema);
