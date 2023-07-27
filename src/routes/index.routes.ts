import express from "express";
import jobRouter from "./job.routes.js"
import authMiddleware from "../middleware/auth.js";
import jobCategoryRouter from "./jobCategory.routes.js"
const router = express.Router();

router.use('/test', ()=>{});
router.use('/job', jobRouter);
router.use('/category', jobCategoryRouter);

export default router