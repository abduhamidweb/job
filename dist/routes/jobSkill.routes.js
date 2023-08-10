import { Router } from 'express';
import SkillController from '../controllers/jobSkill.controller.js';
export const router = Router();
router.post('/', SkillController.postSkill.bind(SkillController));
router.get('/', SkillController.getAllSkills.bind(SkillController));
router.put('/:id', SkillController.updateSkill.bind(SkillController));
router.delete('/:id', SkillController.deleteSkill.bind(SkillController));
