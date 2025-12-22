import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export default async function adminAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select("-password");
    next();
  } catch {
    res.status(401).json({ message: "Admin not authorized" });
  }
}
