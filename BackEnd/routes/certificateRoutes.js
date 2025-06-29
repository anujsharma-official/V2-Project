// routes/certificateRoutes.js

import express from "express";
import multer from "multer";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import Certificate from "../models/Certificate.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Create or Add Certificate
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, issuer, category } = req.body;
    const filePath = req.file.path;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "certificates",
    });
    fs.unlinkSync(filePath);

    const cert = await Certificate.create({
      title, issuer, category,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
    });

    return res.json({ success: true, message: "Certificate added", cert });
  } catch (error) {
    console.error("Add Cert Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Read All Certificates
router.get("/", async (req, res) => {
  const list = await Certificate.find().sort({ createdAt: -1 });
  res.json(list);
});

// Update Certificate
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, issuer, category } = req.body;
    const updates = { title, issuer, category };

    if (req.file) {
      const old = await Certificate.findById(req.params.id);
      if (old?.cloudinaryId) {
        await cloudinary.uploader.destroy(old.cloudinaryId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "certificates",
      });
      fs.unlinkSync(req.file.path);

      updates.imageUrl = result.secure_url;
      updates.cloudinaryId = result.public_id;
    }

    const cert = await Certificate.findByIdAndUpdate(req.params.id, updates, { new: true });
    return res.json({ success: true, message: "Certificate updated", cert });
  } catch (error) {
    console.error("Update Cert Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Delete Certificate
router.delete("/:id", async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ success: false, message: "Not found" });

    await cloudinary.uploader.destroy(cert.cloudinaryId);
    await Certificate.deleteOne({ _id: req.params.id });

    return res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete Cert Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
