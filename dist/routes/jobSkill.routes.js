import { Router } from 'express';
import SkillController from '../controllers/jobSkill.controller.js';
import authMiddleware from '../middleware/auth.js';
export const router = Router();
// router.post('/',authMiddleware, SkillController.postSkill.bind(SkillController));
router.get('/', SkillController.getAllSkills.bind(SkillController));
router.put('/:id', authMiddleware, SkillController.updateSkill.bind(SkillController));
router.delete('/:id', authMiddleware, SkillController.deleteSkill.bind(SkillController));
