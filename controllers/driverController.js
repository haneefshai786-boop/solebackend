// controllers/driverController.js
import Driver from "../models/driverModel.js";
import UserOrder from "../models/UserOrder.js";
import jwt from "jsonwebtoken";

/* ================================
   REGISTER DRIVER
================================ */
export const registerDriver = async (req, res) => {
  try {
    const { name, email, phone, password, latitude, longitude } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Driver.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Driver already exists" });
    }

    // Do NOT hash manually! The schema pre-save hook handles it
    const driver = await Driver.create({
      name,
      email,
      phone,
      password,
      location: {
        type: "Point",
        coordinates: [longitude || 0, latitude || 0],
      },
      status: "Available",
    });

    const token = jwt.sign({ id: driver._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ driver, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Driver registration failed" });
  }
};

/* ================================
   LOGIN DRIVER
================================ */
export const loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;

    const driver = await Driver.findOne({ email });
    if (!driver) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare entered password with hashed password
    const isMatch = await driver.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: driver._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ driver, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Driver login failed" });
  }
};

/* ================================
   UPDATE DRIVER LOCATION
================================ */
export const updateDriverLocation = async (req, res) => {
  try {
    const { latitude, longitude, status } = req.body;

    const driver = await Driver.findById(req.driver.id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    if (latitude && longitude) {
      driver.location = { type: "Point", coordinates: [longitude, latitude] };
    }

    if (status) driver.status = status;

    await driver.save();
    res.json({ message: "Location updated", driver });
  } catch (err) {
    res.status(500).json({ message: "Failed to update location" });
  }
};

/* ================================
   GET ASSIGNED ORDERS
================================ */
export const getDriverOrders = async (req, res) => {
  try {
    const orders = await UserOrder.find({ driver: req.driver.id })
      .populate("user", "name phone")
      .populate("products.product", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* ================================
   UPDATE ORDER STATUS
================================ */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await UserOrder.findOne({ _id: orderId, driver: req.driver.id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.driverStatus = status;

    if (status === "Delivered") order.status = "Completed";

    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to update order" });
  }
};
