import { Router } from 'express';
import ExperienceController from '../controllers/experience.controller.js';
export const router = Router();
router.post('/', ExperienceController.postExperience.bind(ExperienceController));
router.get('/', ExperienceController.getAllExperience.bind(ExperienceController));
router.put('/:id', ExperienceController.updateExperience.bind(ExperienceController));
router.delete('/:id', ExperienceController.deleteExperience.bind(ExperienceController));
