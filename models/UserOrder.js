import mongoose from "mongoose";

const userOrderSchema = new mongoose.Schema(
  {
    /* USER */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* PRODUCTS */
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        qty: {
          type: Number,
          required: true,
        },
      },
    ],

    /* TOTAL */
    total: {
      type: Number,
      required: true,
    },

    /* ORDER STATUS */
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Preparing",
        "OutForDelivery",
        "Delivered",
        "Completed",
      ],
      default: "Pending",
    },

    /* PAYMENT */
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    /* DELIVERY DETAILS */
    address: String,
    phone: String,

    /* 📍 DELIVERY LOCATION (NEW) */
    deliveryLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },

    /* 🚴 ASSIGNED DRIVER (NEW) */
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },

    /* DRIVER STATUS */
    driverStatus: {
      type: String,
      enum: ["Unassigned", "Assigned", "PickedUp", "Delivered"],
      default: "Unassigned",
    },
  },
  { timestamps: true }
);

/* GEO INDEX FOR DRIVER SEARCH */
userOrderSchema.index({ deliveryLocation: "2dsphere" });

export default mongoose.model("UserOrder", userOrderSchema);
