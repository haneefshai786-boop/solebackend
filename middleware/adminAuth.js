// middleware/adminAuth.js
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const adminAuth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ message: "Admin not found" });

    req.admin = admin; // attach admin to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token verification failed" });
  }
};
