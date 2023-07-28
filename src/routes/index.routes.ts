import express from "express";
import { router as skillRouter } from "./jobSkill.routes.js";
import { router as employeeRouter } from "./eployee.routes.js";

const router = express.Router();


router.use('/test', () => {
});
router.use('/skills', skillRouter);
router.use('/employees', employeeRouter);


export default router