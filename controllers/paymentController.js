import Payment from "../models/Payment.js";
import Order from "../models/UserOrder.js";

// Create payment record
export const createPayment = async (req, res) => {
  try {
    const { orderId, userId, amount, method } = req.body;
    if (!orderId || !userId || !amount || !method) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const payment = new Payment({ order: orderId, user: userId, amount, method });
    await payment.save();

    res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create payment" });
  }
};

// Get all payments (admin)
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("order").populate("user");
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = status;
    await payment.save();

    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update payment status" });
  }
};

// Delete payment
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    await payment.deleteOne();
    res.json({ message: "Payment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete payment" });
  }
};
