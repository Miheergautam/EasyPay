const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const authMiddleware = require("../Middleware/jwt");
const Account = require("../models/account");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Schema for user signup validation using zod
const signupSchema = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string().min(8),
});

// User signup route
router.post("/signup", async (req, res) => {
  // Validate request body against schema
  const { success, error } = signupSchema.safeParse(req.body);

  if (!success) {
    // Respond with validation errors
    return res.status(400).json({ message: "Incorrect Inputs" });
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ username: req.body.username });

  if (existingUser) {
    // Respond if username is already taken
    return res.status(409).json({ message: "Email Already Taken" });
  }

  try {
    // Hash the user's password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user
    const user = await User.create({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashedPassword,
    });

    // Create a new account with a random balance for the new user
    await Account.create({
      userId: user._id,
      balance: 1 + Math.random() * 1000,
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Respond with success message and token
    res
      .status(201)
      .json({ message: "User Created", userId: user._id, token: token });
  } catch (error) {
    // Respond with server error
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Schema for user signin validation using zod
const signinSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

// User signin route
router.post("/signin", async (req, res) => {
  // Validate request body against schema
  const { success, error } = signinSchema.safeParse(req.body);

  if (!success) {
    // Respond with validation errors
    return res.status(400).json({ message: "Incorrect Inputs" });
  }

  // Find user by username
  const user = await User.findOne({
    username: req.body.username,
  });

  if (user) {
    // Compare passwords
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (passwordMatch) {
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      // Respond with success message and token
      return res
        .status(200)
        .json({ message: "Signin Successful", token: token });
    }
  }

  // Respond with invalid credentials message
  res.status(401).json({ message: "Invalid Credentials" });
});

// Schema for updating user details
const updateSchema = zod.object({
  password: zod.string().min(8),
  firstName: zod.string(),
  lastName: zod.string(),
});

// User update route
router.put("/update", authMiddleware, async (req, res) => {
  // Validate request body against schema
  const { success, error } = updateSchema.safeParse(req.body);

  if (!success) {
    // Respond with validation errors
    return res.status(400).json({ message: "Incorrect Inputs" });
  }

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Update user details
    await User.findByIdAndUpdate(req.userId, {
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    // Respond with success message
    res.status(200).json({ message: "User Updated" });
  } catch (error) {
    // Respond with server error
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to get users in bulk with optional filter
router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  try {
    // Find users with first or last name matching the filter
    const users = await User.find({
      $or: [
        { firstName: { $regex: filter } },
        { lastName: { $regex: filter } },
      ],
    });

    // Respond with user details
    res.json({
      users: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  } catch (error) {
    // Respond with server error
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
