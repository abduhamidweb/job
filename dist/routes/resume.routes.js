import express from "express";
import { ResumeController } from "../controllers/resume.contr.js";
const router = express.Router();
const resumeController = new ResumeController();
router.post("/", resumeController.createResume); // POST so'rovi
router.put("/:resumeId", resumeController.updateResume);
export default router;
