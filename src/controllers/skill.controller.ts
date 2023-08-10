import { Request, Response } from "express";
import Skill from "../schemas/skill.schema.js";

export class SkillContr {
  static async postSkill(req: Request, res: Response) {
    try {
      const { skill, experience, level } = req.body;
      if (!skill || !level || !experience) {
        throw new Error(`Data is incompleted!`);
      }
      const newType = await Skill.create({ skill, experience, level });
      await newType.save();

      const userId = req.headers.token as string;

      res.send({
        status: 200,
        message: `The skill was added successfuly!`,
        success: true,
        data: newType,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message, status: 500 });
    }
  }

  static async getSkill(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (id) {
        const findById = await Skill.findById(id);
        if (findById == null) {
          throw new Error(`Not Found!`);
        } else {
          res.send({
            status: 200,
            message: `Found`,
            success: true,
            data: findById,
          });
        }
      } else {
        res.send({
          status: 200,
          message: `All info`,
          success: true,
          data: await Skill.find(),
        });
      }
    } catch (error: any) {
      return res.status(500).json({ message: error.message, status: 500 });
    }
  }

  static async putSkill(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const checkExists = await Skill.findById(id);
      if (checkExists == null) {
        throw new Error(`Not found the skill`);
      }
      const { skill, experience, level } = req.body;
      if (!skill && !level && !experience) {
        throw new Error(`there is no data!`);
      }
      const updatedSkill = await Skill.findByIdAndUpdate(
        id,
        { skill, experience, level },
        { new: true }
      );

      const userId = req.headers.token as string;

      res.send({
        status: 200,
        message: `Skill was updated successfuly!`,
        success: true,
        data: updatedSkill,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message, status: 500 });
    }
  }

  static async deleteSkill(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const checkExists = await Skill.findById(id);
      if (checkExists == null) {
        throw new Error(`Not found info`);
      }
      const deletedSkill = await Skill.findByIdAndDelete(id);

      const userId = req.headers.token as string;
      
      res.send({
        status: 200,
        message: `Skill was deleted successfuly!`,
        success: true,
        data: deletedSkill,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message, status: 500 });
    }
  }
}
