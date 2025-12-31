import Driver from "../models/driverModel.js";
import UserOrder from "../models/UserOrder.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* =========================
   TOKEN GENERATOR
========================= */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

/* =========================
   REGISTER DRIVER
========================= */
export const registerDriver = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    const exists = await Driver.findOne({ phone });
    if (exists) {
      return res.status(400).json({ message: "Driver already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const driver = await Driver.create({
      name,
      phone,
      password: hashedPassword,
      status: "Available",
    });

    res.status(201).json({
      _id: driver._id,
      name: driver.name,
      phone: driver.phone,
      token: generateToken(driver._id),
    });
  } catch (err) {
    console.error("Register Driver Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   LOGIN DRIVER
========================= */
export const loginDriver = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const driver = await Driver.findOne({ phone });
    if (!driver) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, driver.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: driver._id,
      name: driver.name,
      phone: driver.phone,
      token: generateToken(driver._id),
    });
  } catch (err) {
    console.error("Login Driver Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   DRIVER PROFILE
========================= */
export const getDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findById(req.driver._id).select("-password");
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   UPDATE DRIVER LOCATION
========================= */
export const updateDriverLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const driver = await Driver.findById(req.driver._id);

    driver.location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };

    await driver.save();
    res.json({ message: "Location updated" });
  } catch (err) {
    console.error("Update Location Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET DRIVER ORDERS
========================= */
export const getDriverOrders = async (req, res) => {
  try {
    const orders = await UserOrder.find({ driver: req.driver._id })
      .populate("user", "name phone")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Get Driver Orders Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   UPDATE ORDER STATUS
========================= */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await UserOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (String(order.driver) !== String(req.driver._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.driverStatus = status;

    if (status === "Delivered") {
      order.status = "Completed";

      const driver = await Driver.findById(req.driver._id);
      driver.status = "Available";
      await driver.save();
    }

    await order.save();

    const io = req.app.get("io");

    // notify user
    io?.to(`user-${order.user}`).emit("order-updated", order);

    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Update Order Status Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
