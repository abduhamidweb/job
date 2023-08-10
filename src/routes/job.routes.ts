import { Router } from "express";
import job from "../controllers/job.contr.js";
const router: Router = Router();
router.get('/', job.getAllFileData);
router.get('/location', job.getComLocations)
router.get('/search', job.searchByCriteria)
router.get('/:id', job.getFileDataById);
router.post('/', job.createFileData);
router.put('/:id', job.updateFileData);
router.delete('/:id', job.deleteFileData);
export default router;