import express from "express";
import {
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Protected route example
router.get("/dashboard", protect, (req, res) => {
  res.json({ message: "Welcome Admin!" });
});

export default router;
