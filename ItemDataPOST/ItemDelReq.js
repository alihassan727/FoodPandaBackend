import express from "express";
import mongoose from "mongoose";
import authmiddleware from "../MiddleWare/middleware.js";
import { ItemData } from "./itemPostReq.js";

const router = express.Router();

const deleteFunc = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid item id" });
    }
    const deletedItem = await ItemData.findOneAndDelete({
      _id: productId,
      owner: req.userId,
    });
    if (!deletedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    console.error("Item Update Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

router.delete("/:id", authmiddleware, deleteFunc);

export default router;
