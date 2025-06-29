import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/admin-data", verifyToken, (req, res) => {
  res.json({ message: "You are authenticated", adminId: req.adminId });
});

export default router;