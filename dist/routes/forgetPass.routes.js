import { Router } from "express";
import forgetPassController from "../controllers/forgetPass.controller.js";
const router = Router();
let { forgetPass } = forgetPassController;
router.post("/", forgetPass);
export default router;
