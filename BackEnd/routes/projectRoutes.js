import express from "express";
import multer from "multer";
import {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), createProject);
router.get("/", getAllProjects);
router.put("/:id", upload.single("image"), updateProject);
router.delete("/:id", deleteProject);

export default router;
