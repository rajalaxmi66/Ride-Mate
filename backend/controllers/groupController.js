// backend/controllers/groupController.js
const RideGroup = require("../models/RideGroup");
const axios = require("axios");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); // load .env only locally
}

// ✅ User joins a group
exports.joinGroup = async (req, res) => {
  try {
    const { sourceLat, sourceLng } = req.body;
    const group = await RideGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const alreadyJoined = group.users.some(
      (u) => String(u.userId) === String(req.user.id)
    );
    if (alreadyJoined)
      return res.status(400).json({ message: "User already in group" });

    group.users.push({
      userId: req.user.id,
      location: { lat: sourceLat, lng: sourceLng },
      confirmed: false,
      arrived: false,
    });

    await group.save();
    res.json(group);
  } catch (err) {
    console.error("joinGroup error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get group locations (users + common pickup)
exports.getGroupLocations = async (req, res) => {
  try {
    const group = await RideGroup.findById(req.params.groupId)
      .populate("users.userId", "name email");

    if (!group) return res.status(404).json({ message: "Group not found" });

    const locations = group.users.map((u) => ({
      _id: u.userId._id,
      name: u.userId.name,
      location: u.location,
      arrived: u.arrived,
    }));

    res.json({
      locations,
      commonPickup: group.commonPickup,
      status: group.status,
    });
  } catch (err) {
    console.error("getGroupLocations error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Generate common pickup with Google Reverse Geocoding
exports.generateCommonPickup = async (req, res) => {
  try {
    const group = await RideGroup.findById(req.params.groupId).populate(
      "users.userId",
      "name phone"
    );
    if (!group) return res.status(404).json({ message: "Group not found" });

    const validUsers = group.users.filter(
      (u) => u.location && u.location.lat != null && u.location.lng != null
    );

    if (validUsers.length < 1)
      return res.status(400).json({ message: "No members with location available" });

    // Average lat/lng
    const avgLat =
      validUsers.reduce((sum, u) => sum + u.location.lat, 0) / validUsers.length;
    const avgLng =
      validUsers.reduce((sum, u) => sum + u.location.lng, 0) / validUsers.length;

    // Default name in case Google fails
    let placeName = "Auto Generated Pickup Point";

    try {
      const geoRes = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            latlng: `${avgLat},${avgLng}`,
            key: process.env.GOOGLE_MAPS_KEY,
          },
        }
      );

      if (geoRes.data.status === "OK" && geoRes.data.results.length > 0) {
        placeName = geoRes.data.results[0].formatted_address;
      } else {
        console.warn(
          "Geocoding API returned no results:",
          geoRes.data.status,
          geoRes.data.error_message || ""
        );
      }
    } catch (err) {
      console.error("Google Geocoding API error:", err.message);
    }

    group.commonPickup = { lat: avgLat, lng: avgLng, place: placeName };
    group.status = "READY"; // ready for members

    await group.save();

    res.json(group.commonPickup);
  } catch (err) {
    console.error("generateCommonPickup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update user location & auto-arrival
exports.updateUserLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const group = await RideGroup.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.status === "COMPLETED") return res.json({ message: "Ride already completed" });

    const user = group.users.find((u) => u.userId.toString() === req.user.id);
    if (!user) return res.status(403).json({ message: "User not in group" });

    if (!user.location || user.location.lat !== lat || user.location.lng !== lng) {
      user.location = { lat, lng };
    }

    // AUTO ARRIVAL
    if (!user.arrived && group.commonPickup?.lat && group.commonPickup?.lng) {
      const distance = getDistanceMeters(lat, lng, group.commonPickup.lat, group.commonPickup.lng);
      if (distance <= 50) user.arrived = true;
    }

    // COMPLETE RIDE IF ALL ARRIVED
    if (group.users.length >= 2 && group.users.every((u) => u.arrived)) {
      group.status = "COMPLETED";
    }

    await group.save();

    res.json({
      arrived: user.arrived,
      groupStatus: group.status,
    });
  } catch (err) {
    console.error("updateUserLocation error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================== Helper Function ==================
function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const toRad = (val) => (val * Math.PI) / 180;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}