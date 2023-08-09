import express from "express";
import jobRouter from "./job.routes.js"
import infoRouter from "./info.routes.js"
import moneyRouter from "./money.routes.js"
import UserRoutes from './User/user.routes.js'
import educationRouter from "./education.routes.js";
import authMiddleware from "../middleware/auth.js";
import { router as skillRouter } from "./jobSkill.routes.js";
import jobCategoryRouter from "./jobCategory.routes.js"
import { router as employeeRouter } from "./eployee.routes.js";
const router = express.Router();

router.use('/test', () => { });
router.use('/job', jobRouter);
router.use('/info', infoRouter);
router.use('/skills', skillRouter);
router.use('/user', UserRoutes);
router.use('/money', moneyRouter);
router.use('/education', educationRouter);
router.use('/employees', employeeRouter);
router.use('/category', jobCategoryRouter);

export default router
