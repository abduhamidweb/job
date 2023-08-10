import { IFileData } from "../interface/interface.js";
import infoSchema from "../schemas/info.schema.js";
import { Request, Response } from "express";
import FileDataModel from "../schemas/job.schema.js";

export class InfoContr {
  constructor() { }
  static async getInfo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (id) {
        const findById = await infoSchema.findById(id);
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
          data: await infoSchema.find(),
        });
      }
    } catch (error: any) {
      return res.status(500).json({ message: error.message, status: 500 });
    }
  }

  static async addInfo(req: Request, res: Response) {
    try {
      const { jobText, job_id } = req.body;
      if (!jobText || !job_id) {
        throw new Error(`Data is incompleted!`);
      }

      const newInfo = await infoSchema.create({ jobText, job_id });
      if (job_id) {
        const job: IFileData | null = await FileDataModel.findById(job_id);
        if (job) {
          job.moreInfo.push(newInfo._id);
          await job.save();
        } else {
          const errorMessage = 'Job kategoriyasi topilmadi';
          console.error(errorMessage);
          return res.status(404).json({ message: errorMessage, status: 404 });
        }
      }
      await newInfo.save();
      res.send({
        status: 200,
        message: `Info added successfuly!`,
        success: true,
        data: newInfo,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message, status: 500 });
    }
  }

  static async putInfo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const checkExists = await infoSchema.findById(id);
      if (checkExists == null) {
        throw new Error(`Not found info`);
      }
      const { jobText, job_id } = req.body;
      if (!jobText && !job_id) {
        throw new Error(`there is no data!`);
      }
      const updatedInfo = await infoSchema.findByIdAndUpdate(
        id,
        { jobText, job_id },
        { new: true }
      );
      res.send({
        status: 200,
        message: `Info was updated successfuly!`,
        success: true,
        data: updatedInfo,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message, status: 500 });
    }
  }

  static async deleteInfo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const checkExists = await infoSchema.findById(id);
      if (checkExists == null) {
        throw new Error(`Not found info`);
      }
      const deletedInfo = await infoSchema.findByIdAndDelete(id);
      res.send({
        status: 200,
        message: `Info was deleted successfuly!`,
        success: true,
        data: deletedInfo,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message, status: 500 });
    }
  }
}
