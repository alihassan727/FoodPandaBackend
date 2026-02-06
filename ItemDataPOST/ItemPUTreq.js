import express from "express";
import multer from "multer";
import cloudinary from "../cloudinary.js";
import streamifier from "streamifier";
import authmiddleware from "../MiddleWare/middleware.js";
import { ItemData } from "./itemPostReq.js";

const router = express.Router();
const upload = multer();

const updateFunc = async (req, res) => {
  try {
    const productId = req.params.id;
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
      const price = Number(updateData.item_price);
      if (isNaN(price)) {
        return res.status(400).json({
          success: false,
          message: "Invalid price value",
        });
      }
      updateData.item_price = Number(updateData.item_price);
    }

    const updatedItem = await ItemData.findByIdAndUpdate(
      { _id: productId, owner: req.userId },
      updateData,
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "Item Updated Successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Item Update Error:", error);
  }
};

router.put("/:id", authmiddleware, upload.single("item_image"), updateFunc);
export default router;
