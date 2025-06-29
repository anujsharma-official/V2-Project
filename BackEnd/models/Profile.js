import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  cloudinaryId: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Profile", profileSchema);
