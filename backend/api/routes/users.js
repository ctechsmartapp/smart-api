import express from "express";
import User from "../models/user.js";
import { authenticateAccessToken } from "../utils/authUtils.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

router.get("", authenticateAccessToken, async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(201).json({
      message: "Users Found",
      users,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/details", authenticateAccessToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.status(201).json({
      message: "User Details Found",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get(
  "/userDetailsById/:id",
  authenticateAccessToken,
  async (req, res) => {
    try {
      const requester = req.user;

      if (requester.role === ROLES.CONSULTANT) {
        return res.status(403).json({
          error:
            "Access denied. Only marketers and admins can perform this action.",
        });
      }
      const { id } = req.params;
      const user = await User.findByPk(id);
      res.status(201).json({
        message: "User Details Found",
        user,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
