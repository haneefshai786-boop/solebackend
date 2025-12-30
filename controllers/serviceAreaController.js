import ServiceArea from "../models/ServiceArea.js";

/* ------------------ Get all service areas ------------------ */
export const getServiceAreas = async (req, res) => {
  try {
    const areas = await ServiceArea.find();
    res.json(areas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch service areas" });
  }
};

/* ------------------ Create new service area (Admin) ------------------ */
export const createServiceArea = async (req, res) => {
  try {
    const { name, area } = req.body;

    if (!name || !area || !area.coordinates || area.coordinates.length === 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Ensure polygon is closed
    const polygon = [...area.coordinates[0]];
    if (
      polygon.length > 0 &&
      (polygon[0][0] !== polygon[polygon.length - 1][0] ||
        polygon[0][1] !== polygon[polygon.length - 1][1])
    ) {
      polygon.push(polygon[0]);
    }

    const newArea = new ServiceArea({
      name,
      area: {
        type: "Polygon",
        coordinates: [polygon],
      },
      createdBy: req.admin?._id || null,
    });

    await newArea.save();
    res.status(201).json(newArea);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save service area" });
  }
};

/* ------------------ Update service area (Admin) ------------------ */
export const updateServiceArea = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, area } = req.body;

    if (!name || !area || !area.coordinates || area.coordinates.length === 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Ensure polygon is closed
    const polygon = [...area.coordinates[0]];
    if (
      polygon.length > 0 &&
      (polygon[0][0] !== polygon[polygon.length - 1][0] ||
        polygon[0][1] !== polygon[polygon.length - 1][1])
    ) {
      polygon.push(polygon[0]);
    }

    const updatedArea = await ServiceArea.findByIdAndUpdate(
      id,
      {
        name,
        area: {
          type: "Polygon",
          coordinates: [polygon],
        },
      },
      { new: true }
    );

    if (!updatedArea) {
      return res.status(404).json({ message: "Service area not found" });
    }

    res.json(updatedArea);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update service area" });
  }
};

/* ------------------ Delete service area (Admin) ------------------ */
export const deleteServiceArea = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ServiceArea.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Service area not found" });
    }

    res.json({ message: "Service area deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete service area" });
  }
};

/* ------------------ Check service availability (Checkout) ------------------ */
export const checkServiceArea = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude required" });
    }

    // MongoDB expects [lng, lat]
    const point = {
      type: "Point",
      coordinates: [Number(longitude), Number(latitude)],
    };

    const area = await ServiceArea.findOne({
      area: {
        $geoIntersects: {
          $geometry: point,
        },
      },
    });

    if (!area) {
      return res.json({
        serviceable: false,
        message: "Service not available at your location",
      });
    }

    res.json({
      serviceable: true,
      area: {
        id: area._id,
        name: area.name,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Service check failed" });
  }
};
