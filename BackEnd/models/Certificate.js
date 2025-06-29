// models/Certificate.js
import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  imageUrl: { type: String, required: true },
  cloudinaryId: { type: String, required: true },
  category: {
    type: String,
    enum: ["frontend", "backend", "fullstack"],
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Certificate", certificateSchema);
