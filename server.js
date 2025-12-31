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
app.use(cors({ origin: "*", methods: ["GET","POST","PUT","DELETE","OPTIONS"], credentials: true }));
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Socket.IO setup
const io = new Server(server, { cors: { origin: "*" } });
app.set("io", io);

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("join-driver", (driverId) => {
    if (!driverId) return;
    socket.join(`driver-${driverId}`);
    console.log(`🚚 Driver joined room: driver-${driverId}`);
  });

  socket.on("join-user", (userId) => {
    if (!userId) return;
    socket.join(`user-${userId}`);
    console.log(`👤 User joined room: user-${userId}`);
  });

  socket.on("join-admin", () => {
    socket.join("admin");
    console.log("🛠 Admin joined room");
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Routes
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
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
