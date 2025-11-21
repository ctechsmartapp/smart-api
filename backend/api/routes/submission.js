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
      created_by: requester.id,
      updated_by: requester.id,
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

// Get all submissions for a marketer
router.get("", authenticateAccessToken, async (req, res) => {
  console.log("Get submissions request received");
  let submissions = [];

  try {
    const requester = req.user;
    // Check if the requester has a role Marketer
    if (requester.role === ROLES.MARKETER) {
      submissions = await Submission.findAll({
        where: { created_by: requester.id },
      });
      console.log(submissions);
    } else if (requester.role === ROLES.ADMIN) {
      submissions = await Submission.findAll();
    } else {
      return res.status(403).json({
        error:
          "Access denied. Only marketers and admins can perform this action.",
      });
    }

    if (submissions.length === 0) {
      return res
        .status(404)
        .json({ message: "No submissions found.", submissions });
    }

    res.status(200).json({
      message: "Submissions retrieved successfully",
      submissions,
    });
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a submission by id
router.get("/:id", authenticateAccessToken, async (req, res) => {
  console.log("Get submission by id received");

  try {
    const requester = req.user;
    // Check if the requester has a role Marketer
    if (requester.role !== ROLES.MARKETER && requester.role !== ROLES.ADMIN) {
      return res.status(403).json({
        error:
          "Access denied. Only marketers and admins can perform this action.",
      });
    }

    const { id } = req.params;
    const submission = await Submission.findByPk(id);

    if (!submission) {
      res.status(404).json({
        message: "Submission not Found",
      });
    } else if (submission.created_by != requester.id) {
      res.status(403).json({
        message:
          "Access Denied. Marketer doesn't have the access to this resource.",
      });
    } else {
      res.status(201).json({
        message: "Submission Details Found",
        submission,
      });
    }
  } catch (err) {
    console.error("Error fetching submission:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a submission by id
router.patch("/:id", authenticateAccessToken, async (req, res) => {
  console.log("Edit submission request received");
  try {
    const requester = req.user;
    // Check if the requester has a role Marketer
    if (requester.role !== ROLES.MARKETER && requester.role !== ROLES.ADMIN) {
      return res.status(403).json({
        error:
          "Access denied. Only marketers and admins can perform this action.",
      });
    }

    const { id } = req.params;
    const submission = await Submission.findByPk(id);

    if (!submission) {
      res.status(404).json({
        message: "Submission not Found",
      });
    } else {
      res.status(201).json({
        message: "Submission Details Found",
        submission,
      });
    }
  } catch (err) {
    console.error("Error fetching submission:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
