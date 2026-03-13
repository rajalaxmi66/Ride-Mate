const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const rideRoutes = require("./routes/rideRoutes");

const groupRoutes = require("./routes/groupRoutes");



const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", require("./routes/user"));
app.use("/api/ride", rideRoutes);
app.use("/api/groups", groupRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Auto Pool Backend is running 🚀");
});
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use("/api", limiter);
const helmet = require("helmet");
app.use(helmet());

// Port
const PORT = process.env.PORT || 5000;

// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });










