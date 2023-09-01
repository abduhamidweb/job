import { Router } from "express";
import skillAndLanguagesContr from "../controllers/skillAndLanguages.contr.js";
import userMiddleware from "../middleware/user.middleware.js";
let { idChecker } = userMiddleware;
let { post } = skillAndLanguagesContr;
const router = Router();
router.post("/", idChecker, post);
export default router;
