import express from "express";
import jobRouter from "./job.routes.js"
import authMiddleware from "../middleware/auth.js";
import jobCategoryRouter from "./jobCategory.routes.js"
import moneyRouter from "./money.routes.js"
import infoRouter from "./info.routes.js"
const router = express.Router();

router.use('/test', () => { });
router.use('/job', jobRouter);
router.use('/info', infoRouter);
router.use('/money', moneyRouter);
router.use('/category', jobCategoryRouter);

export default router