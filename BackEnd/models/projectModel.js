import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String, required: true },
  tags: [String],
  liveUrl: { type: String },
  githubUrl: { type: String },
  category: { type: String, enum: ["frontend", "backend", "fullstack"] },
});

export default mongoose.model("Project", projectSchema);
