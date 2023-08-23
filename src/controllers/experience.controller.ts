import { Request, Response } from "express";
import Experiences from "../schemas/experience.schema.js";
import { IExperience } from "../interface/interface";
import userModel from "../schemas/user.schema.js";
import { JWT } from "../utils/jwt.js";
import userSchema from "../schemas/user.schema.js";

class ExperienceController {

  public async getAllExperience(req: Request, res: Response): Promise<void> {
    try {
      const experiences: IExperience[] | null = await Experiences.find();

      res.status(200).json(experiences);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async updateExperience(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.token as string;
      let userId = JWT.VERIFY(token as string).id;
      const { experience, remoteExperience }: IExperience = req.body;
      if (!userId) {
        const errorMessage = "Bunday user IDlik malumot topilmadi";
        res.status(400).json({ message: errorMessage, status: 400 });
        return;
      }

      const user = await userModel.findById(userId);

      if (!user) {
        const errorMessage = "Bunday User Topilmadi";
        console.error(errorMessage);
        res.status(404).json({ message: errorMessage, status: 404 });
        return;
      }

      console.log(userId)

      const experiencePut = await Experiences.findOneAndUpdate(
        {userId},
        { experience, remoteExperience },
        { new: true }
      );
      console.log(experiencePut);


      if (!experiencePut) {
        const experiencePost = new Experiences({
          experience,
          remoteExperience,
          userId,
        });

        await experiencePost.save();
        await userSchema.findByIdAndUpdate(userId, {
          experience: experiencePost._id,
        });
        res.status(201).json("Successfully created Experience");
      }
      else {
        res.status(200).json("Experience succesfully edited");
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

}

export default new ExperienceController();
