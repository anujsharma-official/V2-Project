import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import path from "path"
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import { protect } from "./middlewares/authMiddleware.js";
import Admin from "./models/Admin.js";



dotenv.config();
const app = express();


const PORT = process.env.PORT || 3000;


const __dirname = path.resolve();


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// app.use(cors({
//   origin: process.env.CLIENT_URL,
//   credentials: true
// }));

// server.js or index.js
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(cors());


app.use(express.json({ limit: "30mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/projects", projectRoutes);



app.use(express.static(path.join(__dirname,"/FrontEnd/dist")));
app.get("*", (_, res) => {
  console.log("Serving index.html");
  res.sendFile(path.resolve(__dirname, "FrontEnd", "dist", "index.html"));
});



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log("Server running on 5000")))
  .catch((err) => console.error(err));