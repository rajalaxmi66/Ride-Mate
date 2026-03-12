const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * =========================
 * REGISTER
 * =========================
 */
exports.register = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    // Validation
    if (!name || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
    });

    // Generate JWT (auto-login after register)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

/**
 * =========================
 * LOGIN
 * =========================
 */
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Validation
    if (!phone || !password) {
      return res.status(400).json({
        message: "Phone and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
