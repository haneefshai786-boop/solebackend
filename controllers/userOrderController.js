import UserOrder from "../models/UserOrder.js";
import Product from "../models/Product.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products in order" });
    }

    // Calculate total
    const total = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create order
    const order = await UserOrder.create({
      user: req.user._id,
      products,
      total,
      status: "Pending",
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating order" });
  }
};

// Get all orders for logged-in user
export const getOrders = async (req, res) => {
  try {
    const orders = await UserOrder.find({ user: req.user._id }).populate("products.product");
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};
