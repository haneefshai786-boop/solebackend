import UserOrder from "../models/UserOrder.js";

export const addToCart = async (req, res) => {
  const { userId, product, quantity } = req.body;
  try {
    let order = await UserOrder.findOne({ user: userId, status: "cart" });
    if (!order) {
      order = await UserOrder.create({ user: userId, products: [{ product, quantity }] });
    } else {
      const index = order.products.findIndex(p => p.product.toString() === product);
      if (index > -1) {
        order.products[index].quantity += quantity;
      } else {
        order.products.push({ product, quantity });
      }
      await order.save();
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCart = async (req, res) => {
  const { userId } = req.query;
  try {
    const order = await UserOrder.findOne({ user: userId, status: "cart" }).populate("products.product");
    res.json(order || { products: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const order = await UserOrder.findOne({ user: userId, status: "cart" });
    if (!order) return res.status(404).json({ message: "Cart not found" });

    order.products = order.products.filter(p => p.product.toString() !== productId);
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
