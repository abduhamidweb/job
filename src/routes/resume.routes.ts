import express from "express";
import { ResumeController } from "../controllers/resume.contr.js";
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
const router = express.Router();
const resumeController = new ResumeController();
router.post("/", resumeController.createResume); // POST so'rovi
router.put("/:resumeId", resumeController.updateResume);
export default router;
