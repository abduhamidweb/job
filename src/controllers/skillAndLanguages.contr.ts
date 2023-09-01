import { Request, Response } from "express";
import userSchema from "../schemas/user.schema.js";
import { JWT } from "../utils/jwt.js";

export default {
    async post(req: Request, res: Response) {
        try {
             let token = req.headers.token as string;
            const userId = JWT.VERIFY(token).id;
            let { skills, language } = req.body
            if (!skills || !language) return res.status(400).json({ message: "Invalid data" });
         await   userSchema.findByIdAndUpdate(userId, {
                lang: language,
             skills
         })
            res.json(await userSchema.findById(userId))

        } catch (error:any) {
                  return res.status(500).json({ message: error.message });

        }
  },
};
 