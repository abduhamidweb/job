import { Router } from "express";
import jobCategoryContr from "../controllers/jobCategory.contr.js";
const router: Router = Router();
router.get('/', jobCategoryContr.getAllJobCategories);
router.get('/:id', jobCategoryContr.getJobCategoryById);
router.post('/', jobCategoryContr.createJobCategory);
router.put('/:id', jobCategoryContr.updateJobCategory);
router.delete('/:id', jobCategoryContr.deleteJobCategory);
export default router;