import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

export default mongoose.model("Folder", FolderSchema);
