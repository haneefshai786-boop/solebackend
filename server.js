import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { Server } from "socket.io";

// Routes
import userOrderRoutes from "./routes/userOrderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subcategoryRoutes from "./routes/subcategoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import serviceAreaRoutes from "./routes/serviceAreaRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: "*", // allow all frontend origins
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  credentials: true
}));
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

<<<<<<< HEAD
// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// API Routes
=======
// Socket.IO setup
const io = new Server(server, { cors: { origin: "*" } });
app.set("io", io); // optional: access io in routes

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  // Driver joins their room
  socket.on("join-driver", (driverId) => {
    if (!driverId) return;
    socket.join(`driver-${driverId}`);
    console.log(`🚚 Driver joined room: driver-${driverId}`);
  });

  // User joins their room
  socket.on("join-user", (userId) => {
    if (!userId) return;
    socket.join(`user-${userId}`);
    console.log(`👤 User joined room: user-${userId}`);
  });

  // Admin joins admin room
  socket.on("join-admin", () => {
    socket.join("admin");
    console.log("🛠 Admin joined room");
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

/**
 * Emit helper functions
 * These can be used in routes after creating/updating orders
 */

// Emit new order to a specific driver
export const emitNewOrder = (order) => {
  if (order.driver?._id) {
    io.to(`driver-${order.driver._id}`).emit("new-order", order);
    console.log(`📦 New order sent to driver-${order.driver._id}`);
  }
};

// Emit order status update to driver
export const emitOrderStatusUpdate = (order) => {
  if (order.driver?._id) {
    io.to(`driver-${order.driver._id}`).emit("order-status-updated", {
      orderId: order._id,
      status: order.driverStatus,
    });
    console.log(`🔄 Order status updated sent to driver-${order.driver._id}`);
  }
};

// Routes
>>>>>>> 90f2324 (Recent edits: fix driver socket, order flow, enums, and frontend updates)
app.use("/api/userorders", userOrderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/service-areas", serviceAreaRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/payments", paymentRoutes);

// Root test route
app.get("/", (req, res) => res.send("Server is running..."));

// Start server
const PORT = process.env.PORT || 3500;
<<<<<<< HEAD
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
=======
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
>>>>>>> 90f2324 (Recent edits: fix driver socket, order flow, enums, and frontend updates)
