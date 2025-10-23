import express from "express";
import Submission from "../models/submission.js";
import { authenticateAccessToken } from "../utils/authUtils.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

// Create a submission
router.post("", authenticateAccessToken, async (req, res) => {
  try {
    const requester = req.user;
    // Check if the requester has a role Marketer
    if (requester.role !== ROLES.MARKETER) {
      return res.status(403).json({
        error: "Access denied. Only marketers can perform this action.",
      });
    }

    const { consultant_id, technology, vendor, client, comments } = req.body;

    // basic validation
    if (!(consultant_id && technology && vendor && client)) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // create submission
    const submission = await Submission.create({
      consultant_id,
      technology,
      vendor,
      client,
      comments,
    });

    res.status(200).json({
      message: "Submission added successfully.",
      submission,
    });
  } catch (err) {
    console.error("Error creating submisison:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
