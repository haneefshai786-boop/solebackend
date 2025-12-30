// middleware/checkServiceArea.js
import ServiceArea from "../models/ServiceArea.js"; // or your zone model

export const checkServiceArea = async (req, res, next) => {
  try {
    const { address } = req.body;
    if (!address) return res.status(400).json({ message: "Address is required" });

    // Example: check city or postal code
    const zone = await ServiceArea.findOne({ city: address.city });
    if (!zone) {
      return res.status(403).json({ message: "Sorry, delivery not available in your area" });
    }

    next();
  } catch (err) {
    console.error("Service area check error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
