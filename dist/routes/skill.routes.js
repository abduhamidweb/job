import { Router } from 'express';
import { SkillContr } from '../controllers/skill.controller.js';
import authMiddleware from '../middleware/auth.js';
const router = Router();
router.get('/', SkillContr.getSkill);
router.post('/', authMiddleware, SkillContr.postSkill);
router.put('/:id', authMiddleware, SkillContr.putSkill);
router.delete('/:id', authMiddleware, SkillContr.deleteSkill);
export default router;
