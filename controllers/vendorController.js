import Vendor from "../models/Vendor.js";
import Folder from "../models/Folder.js";

export const createVendor = async (req, res) => {
  const { name, folder } = req.body;

  if (!name || !folder) {
    return res.status(400).json({ message: "name and folder required" });
  }

  const exists = await Folder.findById(folder);
  if (!exists) return res.status(404).json({ message: "Folder not found" });

  const vendor = await Vendor.create({ name, folder });
  res.status(201).json(vendor);
};

export const getVendorsByFolder = async (req, res) => {
  const { folderId } = req.params;

  const vendors = await Vendor.find({ folder: folderId });
  res.json(vendors);
};
