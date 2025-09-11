import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const router = express.Router();

// POST /signup
router.post("/signup", async (req, res) => {
    console.log("signup req received");
    try {
        const { email, password, firstname, lastname } = req.body;

        // basic validation
        if (!(email && password && firstname && lastname)) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists with this email" });
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
        });

        res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
        },
        });
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

    // optional: generate JWT token here (not included in this snippet)
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
