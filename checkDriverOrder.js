import mongoose from "mongoose";
import dotenv from "dotenv";
import Driver from "./models/driverModel.js";
import UserOrder from "./models/UserOrder.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Haversine formula to calculate distance in meters
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // radius of Earth in meters
  const toRad = (deg) => deg * (Math.PI / 180);

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function checkAssignments() {
  try {
    const drivers = await Driver.find({});
    const orders = await UserOrder.find({});

    console.log("=== Drivers ===");
    drivers.forEach((d) => {
      console.log(`${d.name}: [${d.location.coordinates[0]}, ${d.location.coordinates[1]}], status: ${d.status}`);
    });

    console.log("\n=== Orders ===");
    orders.forEach((o) => {
      console.log(`${o._id}: [${o.deliveryLocation.coordinates[0]}, ${o.deliveryLocation.coordinates[1]}], driverStatus: ${o.driverStatus}`);
      
      drivers.forEach((d) => {
        const dist = getDistance(
          o.deliveryLocation.coordinates[1],
          o.deliveryLocation.coordinates[0],
          d.location.coordinates[1],
          d.location.coordinates[0]
        );
        console.log(`   Distance to ${d.name}: ${dist.toFixed(1)} meters`);
      });
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkAssignments();
