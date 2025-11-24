import express from "express";
import Submission from "../models/submission.js";
import { authenticateAccessToken } from "../utils/authUtils.js";
import { ROLES } from "../constants/roles.js";
import Consultant from "../models/consultant.js";

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
    console.log("Create Submission request received");
    console.log(req.body);
    const {
      consultant_id,
      technology,
      vendor,
      client,
      comments,
      interview_date,
    } = req.body;

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
      interview_date: interview_date ? interview_date : null,
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

  try {
    const requester = req.user;
    let whereCondition = {};

    if (requester.role === ROLES.MARKETER) {
      whereCondition = { created_by: requester.id };
    } else if (requester.role !== ROLES.ADMIN) {
      return res.status(403).json({
        error:
          "Access denied. Only marketers and admins can perform this action.",
      });
    }

    // Fetch submissions with consultant info
    const submissions = await Submission.findAll({
      where: whereCondition,
      include: [
        {
          model: Consultant,
          attributes: ["id", "firstname", "lastname"], // fetch only id and name
        },
      ],
      order: [["created_at", "DESC"]],
    });

    if (submissions.length === 0) {
      return res
        .status(404)
        .json({ message: "No submissions found.", submissions });
    }

    res.status(200).json({
      message: "Submissions retrieved successfully",
      submissions: submissions,
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

// Delete a submission by id
router.delete("/:id", authenticateAccessToken, async (req, res) => {
  console.log("Delete submission request received");

  try {
    const requester = req.user;

    // Only MARKETER or ADMIN can delete
    if (requester.role !== ROLES.MARKETER && requester.role !== ROLES.ADMIN) {
      return res.status(403).json({
        error:
          "Access denied. Only marketers and admins can perform this action.",
      });
    }

    const { id } = req.params;

    // Find the submission
    const submission = await Submission.findByPk(id);

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Optional: restrict marketers to delete only their own submissions
    if (
      requester.role === ROLES.MARKETER &&
      submission.created_by !== requester.id
    ) {
      return res.status(403).json({
        error: "Marketers can only delete their own submissions.",
      });
    }

    // Delete the submission
    await submission.destroy();

    res.status(200).json({ message: "Submission deleted successfully" });
  } catch (err) {
    console.error("Error deleting submission:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
