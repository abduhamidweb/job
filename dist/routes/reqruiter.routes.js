import { Router } from 'express';
import RecruiterController from '../controllers/recruiter.contr.js'; // Import your recruiter controller
import authMiddleware from '../middleware/auth.js';
const router = Router();
router.get('/', RecruiterController.getAllRecruiters);
router.get('/token', RecruiterController.getRecruiterByToken);
router.get('/:id', RecruiterController.getRecruiterById);
router.post('/', RecruiterController.createRecruiter);
router.post('/login', RecruiterController.loginRecruiter);
router.post('/forget', RecruiterController.forgetPass);
router.put('/', authMiddleware, RecruiterController.updateRecruiter);
router.delete('/', authMiddleware, RecruiterController.deleteRecruiter);
export default router;
