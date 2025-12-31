// controllers/userOrderController.js
import UserOrder from "../models/UserOrder.js";
import Product from "../models/Product.js";
import Driver from "../models/driverModel.js";

/**
 * CREATE ORDER
 */
export const createOrder = async (req, res) => {
  try {
    const { products, address, phone, paymentMethod, latitude, longitude } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0)
      return res.status(400).json({ message: "No products in order" });

    let total = 0;
    const orderProducts = [];

    for (const item of products) {
      const productFromDB = await Product.findById(item.product);
      if (!productFromDB)
        return res.status(404).json({ message: `Product not found: ${item.product}` });

      const qty = Number(item.qty) || 1;
      const price = Number(item.price) || productFromDB.price;

      orderProducts.push({ product: productFromDB._id, name: productFromDB.name, price, qty });
      total += price * qty;
    }

    // Create order without driver yet
    const order = await UserOrder.create({
      user: req.user._id,
      products: orderProducts,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
      status: "Pending",
      address,
      phone,
      deliveryLocation: { type: "Point", coordinates: [longitude, latitude] },
      driver: null,
      driverStatus: "Unassigned",
    });

    // Assign nearest available driver
    const nearestDriver = await Driver.findOne({
      status: "Available",
      location: {
        $near: { $geometry: { type: "Point", coordinates: [longitude, latitude] }, $maxDistance: 10000 },
      },
    });

    if (nearestDriver) {
      nearestDriver.status = "Busy";
      await nearestDriver.save();

      order.driver = nearestDriver._id;
      order.driverStatus = "Assigned";
      await order.save();

      // Emit to driver room
      req.app.get("io")?.to(`driver-${nearestDriver._id}`).emit("new-order", order);
      console.log(`📦 New order sent to driver-${nearestDriver._id}`);
    }

    // Emit to user room
    req.app.get("io")?.to(`user-${req.user._id}`).emit("order-updated", order);

    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ message: "Server error creating order" });
  }
};

/**
 * GET ORDERS FOR USER
 */
export const getOrders = async (req, res) => {
  try {
    const orders = await UserOrder.find({ user: req.user._id })
      .populate("products.product", "name price")
      .populate("driver", "name phone");

    res.json(orders);
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};

/**
 * CONFIRM COD PAYMENT
 */
export const confirmCODPayment = async (req, res) => {
  try {
    const order = await UserOrder.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.paymentMethod !== "COD") return res.status(400).json({ message: "Not a COD order" });
    if (order.paymentStatus === "Paid") return res.status(400).json({ message: "COD already confirmed" });

    order.paymentStatus = "Paid";
    order.status = "Confirmed";
    await order.save();

    // Emit to driver and user rooms
    req.app.get("io")?.to(`driver-${order.driver}`).emit("order-updated", order);
    req.app.get("io")?.to(`user-${order.user}`).emit("order-updated", order);

    res.json({ message: "COD payment confirmed", order });
  } catch (err) {
    console.error("Confirm COD Error:", err);
    res.status(500).json({ message: "Server error confirming COD payment" });
  }
};
