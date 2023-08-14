import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import EducationController from "../controllers/education.contr.js"; // I assume you have an "education.contr.ts" file
const router = Router();
router.get('/', EducationController.getAllEducations);
router.get('/:id', EducationController.getEducationById);
router.post('/', authMiddleware, EducationController.createEducation);
router.put('/:id', authMiddleware, EducationController.updateEducation);
router.delete('/:id', authMiddleware, EducationController.deleteEducation);
export default router;
