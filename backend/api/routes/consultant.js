import express from "express";

import Consultant from "../models/consultant.js";
import { authenticateAccessToken } from "../utils/authUtils.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

// Get all consultants
router.get("", authenticateAccessToken, async (req, res) => {
  console.log("Get all consultants request received");

  try {
    const requester = req.user;
    // Check if the requester has a role Marketer
    if (requester.role !== ROLES.MARKETER) {
      return res.status(403).json({
        error: "Access denied. Only marketers can perform this action.",
      });
    }

    const consultants = await Consultant.findAll({
      attributes: ["id", "firstname", "lastname", "email"],
    });

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

// Get a consultant by id
router.get("/:id", authenticateAccessToken, async (req, res) => {
  console.log("Get all consultants request received");

  try {
    const requester = req.user;
    // Check if the requester has a role Marketer
    if (requester.role !== ROLES.MARKETER) {
      return res.status(403).json({
        error: "Access denied. Only marketers can perform this action.",
      });
    }

    const { id } = req.params;
    const consultant = await Consultant.findByPk(id);

    if (!consultant) {
      res.status(404).json({
        message: "Consultant not Found",
      });
    } else {
      res.status(201).json({
        message: "Consultant Details Found",
        consultant,
      });
    }
  } catch (err) {
    console.error("Error fetching consultant:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a consultant
router.post("", authenticateAccessToken, async (req, res) => {
  console.log("Get all consultants request received");

  try {
    const requester = req.user;
    // Check if the requester has a role Marketer
    if (requester.role !== ROLES.MARKETER) {
      return res.status(403).json({
        error: "Access denied. Only marketers can perform this action.",
      });
    }

    const { firstname, lastname, email, phone, legal_status } = req.body;

    // basic validation
    if (!(email && firstname && lastname && phone && legal_status)) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // check if user exists
    const existingUser = await Consultant.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Consultant already exists with this email" });
    }

    // create consultant
    const consultant = await Consultant.create({
      firstname,
      lastname,
      email,
      phone,
      legal_status,
      created_by: requester.id,
    });

    res.status(200).json({
      message: "Consultant added successfully.",
      consultant,
    });
  } catch (err) {
    console.error("Error creating consultants:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
