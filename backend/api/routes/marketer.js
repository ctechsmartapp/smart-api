import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import { authenticateAccessToken, generateAccessToken, getRefreshToken} from "../utils/authUtils.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

// Get new access token
router.get("/getAllConsultants", authenticateAccessToken, async (req, res) => {
  console.log("Get all consultants request received");

  try {
    const requester = req.user;
    // Check if the requester has a role Marketer
    if (requester.role !== ROLES.MARKETER) {
      return res.status(403).json({
        error: "Access denied. Only marketers can perform this action.",
      });
    }

    const consultants = await User.findAll({
      where: { role: ROLES.CONSULTANT },
      attributes: ["id", "firstname", "lastname", "email"],
    });
    console.log("Length ",consultants.length);
    if (consultants.length === 0) {
      return res.status(404).json({ message: "No consultants found." });
    }

    res.status(200).json({
      message: "Consultants retrieved successfully",
      consultants,
    });
  } catch (err) {
    console.error("Error fetching consultants:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default router;
