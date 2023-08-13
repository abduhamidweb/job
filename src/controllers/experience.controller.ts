import { Request, Response } from "express";
import Experiences from "../schemas/experience.schema.js";
import { IExperience } from "../interface/interface";
import userModel from "../schemas/user.schema.js";
import { JWT } from "../utils/jwt.js";
import userSchema from "../schemas/user.schema.js";

class ExperienceController {
    public async postExperience(req: Request, res: Response): Promise<void> {
      
        
        try {
        const token = req.headers.token as string;
        let userId = JWT.VERIFY(token as string).id;
        const { experience, remoteExperience }: IExperience = req.body;
      if (!userId) {
        const errorMessage = "userId kiritilmagan";
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
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } 

  public async getAllExperience(req: Request, res: Response): Promise<void> {
    try {
      const experiences: IExperience[] | null = await Experiences.find();

      res.status(200).json(experiences);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async updateExperience(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { experience, remoteExperience }: IExperience = req.body;

    try {
      const experiencePut = await Experiences.findByIdAndUpdate(
        id,
        { experience, remoteExperience },
        { new: true }
      );

      if (!experiencePut) {
        res.status(404).json({ error: "Experience not found" });
      }
      res.status(200).send("Skill succesfully edited");
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async deleteExperience(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const experience: IExperience | null =
        await Experiences.findByIdAndDelete(id);

      if (!experience) {
        res.status(404).json({ error: "Experience not found" });
      }

      res.status(200).send("Experience succesfully deleted");
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new ExperienceController();
