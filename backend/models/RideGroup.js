const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  description: String,
  placeId: String,
  lat: Number,
  lng: Number,
});

const rideGroupSchema = new mongoose.Schema(
  {
    destination: {
      type: locationSchema,
      required: true,
    },

    users: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        confirmed: {
          type: Boolean,
          default: false,
        },
        arrived: {
          type: Boolean,
          default: false,
        },
        location: {
          lat: Number,
          lng: Number,
        },
      },
    ],

    commonPickup: {
      lat: Number,
      lng: Number,
      place: String,
    },

    pickupOTP: String,

    status: {
      type: String,
      enum: ["FORMING", "READY", "ONGOING", "COMPLETED"],
      default: "FORMING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RideGroup", rideGroupSchema);