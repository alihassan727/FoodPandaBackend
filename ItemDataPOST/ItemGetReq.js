import express from "express";
import authmiddleware from "../MiddleWare/middleware.js";
const router = express.Router();
import { ItemData } from "../ItemDataPOST/itemPostReq.js";

const itemGetFunc = async (req, res) => {
  try {
    const userId = req.userId;
    const userItem = await ItemData.find({ owner: userId });
    res.status(200).json({ success: true, items: userItem });
  } catch (error) {
    console.log("Get Request Error", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

router.get("/", authmiddleware, itemGetFunc);

export default router;
export { ItemData };
