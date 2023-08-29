import { Request, Response } from "express";
import userSchema from "../schemas/user.schema.js";
import workExperience from "../schemas/workExperience.schema.js";
import workProject from "../schemas/workProjects.schema.js";
import { JWT } from "../utils/jwt.js";

export default {
  async post(req: Request, res: Response) {
    try {
      let workId = req.params.id;

      let { projectName, startDate, endDate, workingNow, description, skill } =
        req.body;

      if (!(projectName && startDate) || !(endDate || workingNow)) {
        return res.status(400).json({ message: "Invalid data" });
      }
      if (!["true", "false", true, false].includes(workingNow) && workingNow) {
        return res.status(400).json({ message: "Invalid data" });
      }

      let newWP = await new workProject({
        projectName,
        startDate,
        endDate,
        workingNow,
        description,
        skill,
      });

      newWP.save();

      await workExperience.findByIdAndUpdate(workId, {
        $push: {
          projects: newWP._id,
        },
      });

      res.json(newWP);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
  async get(req: Request, res: Response) {
    try {
      let projectId = req.params.id;

      let projectData = await workProject.findById(projectId);
      if (!projectData)
        return res.status(404).json({ message: "Project not found." });
      return res.status(200).json(projectData);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
  async put(req: Request, res: Response) {
    try {
      let projectId = req.params.id;
      let exData = [
        "projectName",
        "startDate",
        "endDate",
        "workingNow",
        "description",
        "skill",
      ];
      const foundProperty = exData.find((property) => req.body[property]);

      if (Object.keys(req.body).length === 0 || !foundProperty) {
        return res
          .status(400)
          .json({ message: "No data provided for update." });
      }

      await workProject.findByIdAndUpdate(projectId, req.body);
      let projectData = await workProject.findById(projectId);
      console.log(projectId);
      
      res.json(projectData);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
  async del(req: Request, res: Response) {
    try {
      const projectId = req.params.id;
      await workProject.findByIdAndDelete(projectId);
      res.json({ message: "Work project deleted" });
    } catch (error: any) {
      res.status(403).json({ message: error.message });
    }
  },
};
