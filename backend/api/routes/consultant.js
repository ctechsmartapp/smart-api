import express from "express";

import Consultant from "../models/consultant.js";
import { authenticateAccessToken } from "../utils/authUtils.js";
import { ROLES } from "../constants/roles.js";
import { Op } from "sequelize";

const router = express.Router();

// Get all consultants
router.get("", authenticateAccessToken, async (req, res) => {
  console.log("Get consultants request received");

  try {
    const requester = req.user;
    // Check if the requester has a role Marketer
    if (requester.role !== ROLES.MARKETER) {
      return res.status(403).json({
        error: "Access denied. Only marketers can perform this action.",
      });
    }

    const consultants = await Consultant.findAll({
      attributes: [
        "id",
        "firstname",
        "lastname",
        "email",
        "phone",
        "legal_status",
        "created_at",
      ],
    });

    if (consultants.length === 0) {
      return res
        .status(404)
        .json({ message: "No consultants found.", consultants });
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
        .json({ error: "Consultant already exists with this email." });
    }

    existingUser = await Consultant.findOne({ where: { phone } });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Consultant already exists with this phone number." });
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

// Update a consultant
router.patch("/:id", authenticateAccessToken, async (req, res) => {
  console.log("Update consultant request received");

  try {
    const requester = req.user;

    // Only marketers can update
    if (requester.role !== ROLES.MARKETER) {
      return res.status(403).json({
        error: "Access denied. Only marketers can perform this action.",
      });
    }

    const { id } = req.params;

    // Allowed fields ONLY
    const { email, phone, legal_status } = req.body;
    console.log(req.body);

    if (!(email || phone || legal_status)) {
      return res
        .status(400)
        .json({ error: "No valid fields provided to update" });
    }

    // Find consultant
    const consultant = await Consultant.findByPk(id);
    if (!consultant) {
      return res.status(404).json({ error: "Consultant not found" });
    }

    // Email duplicate check
    if (email) {
      const existingEmail = await Consultant.findOne({
        where: { email, id: { [Op.ne]: id } },
      });

      if (existingEmail) {
        return res
          .status(409)
          .json({ error: "Another consultant already exists with this email" });
      }
    }

    // Phone duplicate check
    if (phone) {
      const existingPhone = await Consultant.findOne({
        where: { phone, id: { [Op.ne]: id } },
      });

      if (existingPhone) {
        return res.status(409).json({
          error: "Another consultant already exists with this phone number",
        });
      }
    }

    // Perform Update
    await consultant.update({
      email: email ?? consultant.email,
      phone: phone ?? consultant.phone,
      legal_status: legal_status ?? consultant.legal_status,
      updated_at: new Date(),
      updated_by: requester.id,
    });

    return res.status(200).json({
      message: "Consultant updated successfully",
      consultant,
    });
  } catch (err) {
    console.error("Error updating consultant:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete Consultant
router.delete("/:id", authenticateAccessToken, async (req, res) => {
  console.log("Delete Consultant request received");
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
      return res.status(403).json({
        errorCode: 403,
        errorMessage: "Consultant not found",
      });
    }

    await consultant.destroy();

    return res.status(200).json({
      errorCode: 200,
      message: "Consultant deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting consultant:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
