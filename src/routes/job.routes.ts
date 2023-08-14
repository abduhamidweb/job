import { Router } from "express";
import job from "../controllers/job.contr.js";
import authMiddleware from "../middleware/auth.js";
const router: Router = Router();
router.get('/', job.getAllFileData);
router.get('/location', job.getComLocations)
router.get('/search', job.searchByCriteria)
router.get('/:id', job.getFileDataById);
router.post('/', authMiddleware, job.createFileData);
router.put('/:id', authMiddleware, job.updateFileData);
router.delete('/:id', authMiddleware, job.deleteFileData);
export default router;