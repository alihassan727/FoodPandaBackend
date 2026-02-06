import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import signupRoutes from "./SignupDB/signupIndex.js";
import loginRoutes from "./LoginDB/loginIndex.js";
import userProfile from "./ProfileData/UserProfile.js";
import itemData from "./ItemDataPOST/itemPostReq.js";
import ItemGetReq from "./ItemDataPOST/ItemGetReq.js";
import ItemUpdateReq from "./ItemDataPOST/ItemPUTreq.js";
import ItemDeleteReq from "./ItemDataPOST/ItemDelReq.js";

//Server Make
const app = express();
app.use(express.json());
app.use(cors());

//Monogo Connect
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("Not Connected", err);
  });

//SignUp POST req use
app.use("/signup", signupRoutes);

//Login POST req use
app.use("/login", loginRoutes);
//User Profile GET req
app.use("/profile", userProfile);
//Item Data POST Req
app.use("/itemdata", itemData);
//Item Data GET req
app.use("/itemdata", ItemGetReq);
//Item Update Req
app.use("/itemdata", ItemUpdateReq);
//Item Delete Req
app.use("/itemdata", ItemDeleteReq);

//Server Start
app.listen(5000, () => {
  console.log("Server is Running");
});
