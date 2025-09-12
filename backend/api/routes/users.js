import express from "express";
import User from "../models/user.js";
import { authenticateAccessToken} from "../utils/authUtils.js";

const router = express.Router();

router.get("", authenticateAccessToken, async (req, res) => {

    try{
        const users = await User.findAll();
        res.status(201).json({
          message: "Users Found",
          users,
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/details", authenticateAccessToken, async (req, res) => {

    try{
        const user = await User.findByPk(req.user.id);
        res.status(201).json({
          message: "User Details Found",
          user,
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;

