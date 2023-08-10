import { Router } from 'express';
import { SkillContr } from '../controllers/skill.controller.js';
const router = Router();

router.get('/', SkillContr.getSkill)
router.post('/', SkillContr.postSkill)
router.put('/:id', SkillContr.putSkill)
router.delete('/:id', SkillContr.deleteSkill)


export default router;