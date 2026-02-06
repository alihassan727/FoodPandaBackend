import express from "express";
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import Login from '../LoginDB/loginIndex.js';

const router = express.Router();

//Signup Schmea
const signupSchema = new Schema({
  name: String,
  email: String,
  number: Number,
  password: String,
  kitchenName: String,
  city: String,
});
const SignUp = mongoose.model("SignUp", signupSchema);
//Signup POST Function
const signUpPost = async (req, res) => {
  try {
    const signupData = req.body;
    const existingUser = await SignUp.findOne({ email: signupData.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email Already Exist " });
    }
    const user = new SignUp(signupData);
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      success: true,
      message: "Signup successful",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
//Signup POST req
router.post("/", signUpPost);

export default router;
export { SignUp };
export { Login };
