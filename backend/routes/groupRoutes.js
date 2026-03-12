// backend/routes/groupRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const groupController = require("../controllers/groupController");

// ✅ Generate common pickup with reverse geocoding
router.post("/generate-common/:groupId", auth, groupController.generateCommonPickup);

// Get all users' locations for a group
router.get("/locations/:groupId", auth, groupController.getGroupLocations);

// Update user location
router.post("/update-location/:groupId", auth, groupController.updateUserLocation);

// Start ride (OTP verification)
router.post("/start-ride/:groupId", auth, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { otp } = req.body;
    const group = await require("../models/RideGroup").findById(groupId);

    if (!group) return res.status(404).json({ message: "Group not found" });
    if (group.pickupOTP !== otp) return res.status(400).json({ message: "Invalid OTP" });

    group.status = "ONGOING";
    await group.save();

    res.json({ message: "Ride started successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single group by ID
router.get("/:groupId", auth, async (req, res) => {
  try {
    const group = await require("../models/RideGroup")
      .findById(req.params.groupId)
      .populate("users.userId", "name email");

    if (!group) return res.status(404).json({ message: "Group not found" });
    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;