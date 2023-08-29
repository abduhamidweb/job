import { Router } from "express";
import workExperienceController from "../controllers/workExperience.controller.js";
import workProjectsContr from "../controllers/workProjects.contr.js";
import authMiddleware from "../middleware/auth.js";
import workExperienceMd from "../middleware/workExperience.md.js";
const router = Router();

let { post}=workProjectsContr
let { getAll, getOne, put, del } = workExperienceController;
let { idAndUserChecker: IUCH, idChecker: ICH } = workExperienceMd;

router.get("/", ICH, getAll);
router.get("/:id", ICH, IUCH, getOne);
router.post("/:id", authMiddleware, post);
router.put("/:id", ICH, IUCH, authMiddleware, put);
router.delete("/:id", ICH, IUCH, authMiddleware, del);

export default router;
