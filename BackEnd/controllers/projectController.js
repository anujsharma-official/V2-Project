import Project from "../models/projectModel.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: Upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = "projects") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Create Project
export const createProject = async (req, res) => {
  try {
    const { title, description, tags, liveUrl, githubUrl, category } = req.body;
    if (!title || !req.file || !category)
      return res.status(400).json({ success: false, message: "All required fields must be filled." });

    const imageUrl = await uploadToCloudinary(req.file.buffer);

    const project = await Project.create({
      title,
      description,
      image: imageUrl,
      tags: tags ? tags.split(",") : [],
      liveUrl,
      githubUrl,
      category,
    });

    res.status(201).json({ success: true, message: "Project added successfully.", project });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Get All Projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch projects" });
  }
};

// Update Project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      updates.image = imageUrl;
    }
    if (updates.tags && typeof updates.tags === "string") {
      updates.tags = updates.tags.split(",");
    }

    const project = await Project.findByIdAndUpdate(id, updates, { new: true });
    res.json({ success: true, message: "Project updated", project });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed", error: err.message });
  }
};

// Delete Project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    res.json({ success: true, message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};
