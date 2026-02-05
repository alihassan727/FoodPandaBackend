import express from "express";
import mongoose, { Schema } from "mongoose";
import { SignUp } from "../SignupDB/signupIndex.js";
import jwt from "jsonwebtoken";


const router = express.Router();

//Login Schema
const loginSchema = {
  email: String,
  password: String,
};
const Login = mongoose.model("Login", loginSchema);
// Login POST Function
const loginPost = async (req, res) => {
  try {
    const loginData = req.body;
    const email = await SignUp.findOne({ email: loginData.email });

    if (!email) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (email.password !== loginData.password) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign({ userId: email._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//POST req
router.post("/", loginPost);

export default router;
