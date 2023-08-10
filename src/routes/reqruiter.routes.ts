import { Router } from 'express';
import RecruiterController from '../controllers/recruiter.schema.js'; // Import your recruiter controller

const router: Router = Router();

router.get('/', RecruiterController.getAllRecruiters);
router.get('/:id', RecruiterController.getRecruiterById);
router.post('/', RecruiterController.createRecruiter);
router.put('/:id', RecruiterController.updateRecruiter);
router.delete('/:id', RecruiterController.deleteRecruiter);

export default router;
