import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import {
  authenticateRefreshToken,
  generateAccessToken,
  getRefreshToken,
} from "../utils/authUtils.js";
import { sendEmail, sendWelcomeEmail } from "../utils/email.js";
import { ROLE_NAMES, ROLES } from "../constants/roles.js";

const router = express.Router();

// POST /signup
router.post("/signup", async (req, res) => {
  console.log("signup req received");
  try {
    const { email, password, firstname, lastname } = req.body;
    const role = ROLES.MARKETER;

    // basic validation
    if (!(email && password && firstname && lastname)) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User already exists with this email" });
    }

    // hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // create user
    const user = await User.create({
      email,
      password_hash: hashedPassword,
      firstname,
      lastname,
      role,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = getRefreshToken(user);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: ROLE_NAMES[role],
      },
      accessToken: accessToken,
      refreshToken: refreshToken,
    });

    await sendWelcomeEmail(user.email, user.firstname);
    res.status(201);
    return res;
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /login
router.post("/login", async (req, res) => {
  console.log("login req received");

  try {
    const { email, password } = req.body;

    // basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // check if user exists
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // compare password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = getRefreshToken(user);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      },
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get new access token
router.post("/refreshToken", authenticateRefreshToken, async (req, res) => {
  console.log("refresh token req received");
  try {
    const user = req.user;
    const accessToken = generateAccessToken(user);
    res.status(200).json({ accessToken: accessToken });
  } catch (err) {
    console.error("Token error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Request OTP
router.post("/forgotPassword", async (req, res) => {
  const { email } = req.body;
  console.log(email);
  const user = await User.findOne({ where: { email } });
  console.log(user);
  if (!user) return res.status(404).json({ error: "User not found" });

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otpCode, 10);

  // Save OTP in user's row with expiry
  await user.update({
    otp_hash: hashedOtp,
    otp_expiration: new Date(Date.now() + 5 * 60 * 1000), // 5 min expiry
  });

  const subject = "Password Reset OTP";
  const body = `<h3>Hi ${user.firstname},</h3>
           <p>Your OTP code is ${otpCode}. It will expire in 5 minutes.</p>`;

  // Send email
  sendEmail(user.email, subject, body);

  res.status(201).json({ message: "OTP sent to email" });
});

// Verify OTP
router.post("/verifyOTP", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Check if OTP exists
    if (!user.otp_hash || !user.otp_expiration) {
      return res.status(400).json({ error: "No OTP generated" });
    }

    // Check expiry
    if (new Date() > user.otp_expiration) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // Compare OTP with hash
    const isMatch = await bcrypt.compare(otp, user.otp_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // OTP verified → clear fields
    await user.update({ otp_hash: null, otp_expiration: null });

    return res.status(201).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Reset Password
router.post("/resetPassword", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // OTP verified → clear fields
    await user.update({ password_hash: hashedPassword });

    const subject = "Password Changed Successful!";
    const body = `<h3>Hi ${user.firstname},</h3>
           <p>Your password has been updated successfully.</p>`;

    // Send email
    sendEmail(user.email, subject, body);

    return res.status(201).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Password change error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
