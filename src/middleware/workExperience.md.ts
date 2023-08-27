import { NextFunction, Request, Response } from "express";
import userSchema from "../schemas/user.schema.js";
import workExperience from "../schemas/workExperience.schema.js";
import { JWT } from "../utils/jwt.js";

export default {
   async idAndUserChecker(req: Request, res: Response, next: NextFunction) {
        try {
             const token = req.headers.token as string;
             const userId = JWT.VERIFY(token).id;
             const workExperienceId = req.params.id;

             const data = await workExperience.findById(workExperienceId);
             const user: any = await userSchema.findById(userId);

             if (!user) {
               return res.status(404).json({ message: "User not found" });
             }
             if (!data) {
               return res
                 .status(404)
                 .json({ message: "Work experience not found" });
             }
             if (!user.workExperience.includes(workExperienceId)) {
               return res
                 .status(403)
                 .json({
                   message: "Unauthorized to update this work experience",
                 });
            }
           return next()
        } catch (error:any) {
            res.status(500).json({ message: error.message });
        }
    },
    async idChecker(req: Request, res: Response, next: NextFunction) {
        try {
            
            const token = req.headers.token as string;
            const userId = JWT.VERIFY(token).id;
            return  next()
        } catch (error) {
                res.status(403).json({ message: "Invalid token" });
            }
            }
}