import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

adminSchema.methods.matchPassword = function (pwd) {
  return bcrypt.compare(pwd, this.password);
};

export default mongoose.model("Admin", adminSchema);
