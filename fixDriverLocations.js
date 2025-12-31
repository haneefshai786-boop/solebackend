// fixDriverLocations.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Driver from "./models/driverModel.js";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

const FIX_COORDINATES = [79.875, 16.9]; // Example: set to your city center

const fixDriverLocations = async () => {
  try {
    const drivers = await Driver.find();

    if (drivers.length === 0) {
      console.log("No drivers found in DB!");
      process.exit();
    }

    for (const driver of drivers) {
      // Only fix if coordinates missing or [0,0]
      const coords = driver.location?.coordinates;
      if (!coords || coords[0] === 0 || coords[1] === 0) {
        driver.location = { type: "Point", coordinates: FIX_COORDINATES };
        driver.status = "Available";
        await driver.save();
        console.log(`✅ Fixed driver: ${driver.name}`);
      } else {
        console.log(`ℹ️ Driver already has valid location: ${driver.name}`);
      }
    }

    console.log("All driver locations checked/updated!");
    process.exit();
  } catch (err) {
    console.error("Error fixing driver locations:", err);
    process.exit(1);
  }
};

fixDriverLocations();
