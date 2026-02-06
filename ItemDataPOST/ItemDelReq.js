import express from "express";
import authmiddleware from "../MiddleWare/middleware.js";
import { ItemData } from "./itemPostReq.js";

const router = express.Router();

const deleteFunc = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedItem = await ItemData.findByIdAndDelete(productId);
    if (!deletedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    console.error("Item Delete Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

router.delete("/:id", authmiddleware, deleteFunc);

export default router;
