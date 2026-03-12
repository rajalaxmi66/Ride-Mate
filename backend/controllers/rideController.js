const RideRequest = require("../models/RideRequest");
const RideGroup = require("../models/RideGroup");

// ===============================
// CREATE RIDE REQUEST
// ===============================
const createRideRequest = async (req, res) => {
  try {
    const { source, destination } = req.body;

    const ride = await RideRequest.create({
      userId: req.user.id,
      source,          // MUST contain lat & lng
      destination,
      status: "SEARCHING",
    });

    res.json({ rideId: ride._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// FIND MATCH
// ===============================
const findMatch = async (req, res) => {
  try {
    const rideId = req.params.id;

    const ride = await RideRequest.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // If already matched
    if (ride.status === "MATCHED" && ride.groupId) {
      return res.json({
        groupId: ride.groupId,
        message: "Already matched",
      });
    }

    // 🔥 ACCURATE MATCHING
    const match = await RideRequest.findOne({
      _id: { $ne: ride._id },
      userId: { $ne: ride.userId }, // prevent self-match
      "source.placeId": ride.source.placeId,
      "destination.placeId": ride.destination.placeId,
      status: "SEARCHING",
    });

    if (!match) {
      return res.json({ message: "No matches found" });
    }

    // Create group
    const group = await RideGroup.create({
      destination: ride.destination,
      users: [
        {
          userId: ride.userId,
          location: {
            lat: ride.source.lat,
            lng: ride.source.lng,
          },
          confirmed: false,
        },
        {
          userId: match.userId,
          location: {
            lat: match.source.lat,
            lng: match.source.lng,
          },
          confirmed: false,
        },
      ],
      status: "FORMING",
    });

    // Update rides
    ride.status = "MATCHED";
    ride.groupId = group._id;
    await ride.save();

    match.status = "MATCHED";
    match.groupId = group._id;
    await match.save();

    res.json({ groupId: group._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createRideRequest,
  findMatch,
};
