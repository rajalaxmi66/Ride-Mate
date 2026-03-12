const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  placeId: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
});

const rideRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    source: {
      type: locationSchema,
      required: true,
    },

    destination: {
      type: locationSchema,
      required: true,
    },

    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RideGroup",
      default: null,
    },

    status: {
      type: String,
      enum: ["SEARCHING", "MATCHED", "COMPLETED"],
      default: "SEARCHING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RideRequest", rideRequestSchema);
