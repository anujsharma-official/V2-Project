// routes/profileRoutes.js

import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import Profile from "../models/Profile.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // 🔥 Step 1: Find the latest profile
    const existing = await Profile.findOne().sort({ _id: -1 });

    // 🔥 Step 2: Delete from Cloudinary + MongoDB if exists
    if (existing) {
      await cloudinary.uploader.destroy(existing.cloudinaryId);
      await Profile.findByIdAndDelete(existing._id);
    }

    // 🔥 Step 3: Upload new image
    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "profiles",
    });

    // 🔥 Step 4: Save new profile
    const newProfile = await Profile.create({
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
    });

    return res.status(200).json({ success: true, profile: newProfile });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/latest", async (req, res) => {
  try {
    const latest = await Profile.findOne().sort({ _id: -1 });
    res.json({ success: true, profile: latest });
  } catch (error) {
    console.error("Fetch profile error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
});
export default router;
