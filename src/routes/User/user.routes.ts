import { Router } from "express";
import userContr from "../../controllers/user.contr.js";
import userMiddleware from "../../middleware/user.middleware.js";
let { checkBody,idChecker,putChecker,isUsersData}=userMiddleware
let {post,get,login,put,delete:del}=userContr

const router = Router();
router.get("/:id", get);
router.post("/",checkBody ,post);
router.post("/login",login);
router.put("/",idChecker, putChecker,  put);
router.delete("/:id",isUsersData, idChecker, del);

export default router;
