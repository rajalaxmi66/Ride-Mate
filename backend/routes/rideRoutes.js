const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createRideRequest,
  findMatch,
} = require("../controllers/rideController");

router.post("/create", auth, createRideRequest);
router.get("/match/:id", auth, findMatch);

module.exports = router;
