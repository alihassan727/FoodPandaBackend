import express from "express";
import multer from "multer";
import cloudinary from "../cloudinary.js";
import streamifier from "streamifier";
import mongoose from "mongoose";
import authmiddleware from "../MiddleWare/middleware.js";
import { ItemData } from "./itemPostReq.js";

const router = express.Router();
const upload = multer();

const updateFunc = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid item id" });
    }
    let updateData = { ...req.body };
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "foodpanda-images" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      updateData.item_image = result.secure_url;
    } else {
      delete updateData.item_image;
    }

    if (updateData.item_price) {
      updateData.item_price = Number(updateData.item_price);
    }

    const updatedItem = await ItemData.findOneAndUpdate(
      { _id: productId, owner: req.userId },
      updateData,
      { new: true },
    );

    if (!updatedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Item Updated Successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Item Update Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

router.put("/:id", authmiddleware, upload.single("item_image"), updateFunc);
export default router;
