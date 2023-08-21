import { Router } from 'express';
import RecruiterController from '../controllers/recruiter.contr.js'; // Import your recruiter controller
import authMiddleware from '../middleware/auth.js';
const router = Router();
router.get('/', RecruiterController.getAllRecruiters);
router.get('/token', RecruiterController.getRecruiterByToken);
router.get('/:id', RecruiterController.getRecruiterById);
router.post('/', RecruiterController.createRecruiter);
router.post('/login', RecruiterController.loginRecruiter);
router.put('/:id', authMiddleware, RecruiterController.updateRecruiter);
router.delete('/:id', authMiddleware, RecruiterController.deleteRecruiter);
export default router;
