import express from "express";
import multer from "multer";
import cloudinary from "../cloudinary.js";
import streamifier from "streamifier";
import mongoose, { Schema } from "mongoose";
import authmiddleware from "../MiddleWare/middleware.js";

const router = express.Router();
const upload = multer();

//Item Data Schema
const itemDataSchema = new Schema({
  item_name: String,
  cuisine_type: String,
  item_type: String,
  item_price: Number,
  item_image: String,
  item_description: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SignUp",
    required: true,
  },
});
//Model make
export const ItemData = mongoose.model("ItemData", itemDataSchema);

//Function for POST Req
const itemDataFunc = async (req, res) => {
  try {
    const itemInfo = { ...req.body };
    itemInfo.owner = req.userId;
    itemInfo.item_price = Number(req.body.item_price);

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "foodpanda-images",
            quality: "auto",
            fetch_format: "auto",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      itemInfo.item_image = result.secure_url;
    }

    const item = new ItemData(itemInfo);
    await item.save();
    res
      .status(201)
      .json({ success: true, message: "Item created successfully", item });
  } catch (error) {
    console.error("Item Upload Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
//POST Route
router.post("/", authmiddleware, upload.single("item_image"), itemDataFunc);

export default router;
