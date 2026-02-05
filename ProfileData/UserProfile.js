import express from "express";
import authmiddleware from "../MiddleWare/middleware.js";
import { SignUp } from "../SignupDB/signupIndex.js";
const router = express.Router();

const profilePost = async (req, res) => {
  try {
    const userId = req.userId;
    const userProfile = await SignUp.findById(userId);
    if (!userProfile) {
      return res
        .status(404)
        .json({ success: false, message: "User not Found" });
    }
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

router.get("/", authmiddleware, profilePost);

export default router;
export { SignUp };