import { Router } from 'express';
import ExperienceController from '../controllers/experience.controller.js';
export const router = Router();
router.get('/', ExperienceController.getAllExperience.bind(ExperienceController));
router.put('/', ExperienceController.updateExperience.bind(ExperienceController));
