import { Request, Response } from "express";
import userSchema from "../schemas/user.schema.js";
import workExperience from "../schemas/workExperience.schema.js";
import { JWT } from "../utils/jwt.js";

export default {
  async post(req: Request, res: Response) {
    try {
      const token = req.headers.token as string;
      const userId: any = JWT.VERIFY(token).id;

      let {
        companyName,
        jobTitle,
        startDate,
        endDate,
        workingNow,
        location,
        description,
        skill,
      } = req.body;

      if (!(companyName && jobTitle && startDate) || !(endDate || workingNow)) {
        return res.status(400).json({ message: "Invalid data" });
      }
      if (!["true", "false", true, false].includes(workingNow) && workingNow) {
        return res.status(400).json({ message: "Invalid data" });
      }
      let newWE = await new workExperience({
        companyName,
        jobTitle,
        startDate,
        endDate,
        workingNow,
        location,
        description,
        skill,
      });

      newWE.save();

      await userSchema.findByIdAndUpdate(userId, {
        $push: {
          workExperience: newWE._id,
        },
      });

      res.json(newWE);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
  async getAll(req: Request, res: Response) {
    try {
      const token = req.headers.token as string;
      const userId = JWT.VERIFY(token).id;
      let user: any = await userSchema
        .findById(userId)
        .populate({
          path: "workExperience",
          populate: { path: "projects" },
        });
      
      if (!user) return res.status(403).json({ message: "User not found" });
      let { workExperience } = user;
      res.send(workExperience);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async getOne(req: Request, res: Response) {
    try {
      const workExperienceId = req.params.id;
      const data = await workExperience
        .findById(workExperienceId)
        .populate("projects");
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async put(req: Request, res: Response) {
    try {
      const token = req.headers.token as string;
      const userId = JWT.VERIFY(token).id;
      const workExperienceId = req.params.id;

      let updateData = req.body as {
        companyName: any;
        jobTitle: any;
        startDate: any;
        endDate: any;
        workingNow: any;
        location: any;
        description: any;
        skill: any;
      };
      let exData = [
        "companyName",
        "jobTitle",
        "startDate",
        "endDate",
        "workingNow",
        "location",
        "description",
        "skill",
      ];

      const foundProperty = exData.find((property) => req.body[property]);

      if (
        (Object.keys(updateData).length === 0 || !foundProperty) &&
        !req.files
      ) {
        return res
          .status(400)
          .json({ message: "No data provided for update." });
      }

      await workExperience.findByIdAndUpdate(workExperienceId, updateData);
      let newWE = await workExperience.findById(workExperienceId);

      await res.json(newWE);
    } catch (error: any) {
      res.status(403).json({ message: error.message });
    }
  },
  async del(req: Request, res: Response) {
    try {
      const token = req.headers.token as string;
      const userId = JWT.VERIFY(token).id;
      const workExperienceId = req.params.id;
      await workExperience.findByIdAndDelete(workExperienceId);
      res.json({ message: "Work experience deleted" });
    } catch (error: any) {
      res.status(403).json({ message: error.message });
    }
  },
};
