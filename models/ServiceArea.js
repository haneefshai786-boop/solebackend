import mongoose from "mongoose";

const serviceAreaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    area: {
      type: {
        type: String,
        enum: ["Polygon"],
        required: true,
      },
      coordinates: {
        type: [[[Number]]], // [[[lng, lat], ...]]
        required: true,
        validate: [
          (val) => val[0].length >= 4, // polygon must have at least 4 points (closed)
          "Polygon must have at least 4 points",
        ],
      },
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

serviceAreaSchema.index({ area: "2dsphere" });

export default mongoose.models.ServiceArea || mongoose.model("ServiceArea", serviceAreaSchema);
