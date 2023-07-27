import typeOfMoneySchema from "../schemas/money.schema.js";
import { Request, Response } from "express";

export class moneyContr {
  constructor() {}
  static async getType(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (id) {
        const findById = await typeOfMoneySchema.findById(id);
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
          message: `All types of money`,
          success: true,
          data: await typeOfMoneySchema.find(),
        });
      }
    } catch (error: any) {
      return res.status(500).json({ message: error.message, status: 500 });
    }
  }

  static async addType(req: Request, res: Response) {
    try {
      const { moneyType, job_id } = req.body;
      if (!moneyType || !job_id) {
        throw new Error(`Data is incompleted!`);
      }

      const newType = await typeOfMoneySchema.create({ moneyType, job_id });
      await newType.save();
      res.send({
        status: 200,
        message: `Type of money added successfuly!`,
        success: true,
        data: newType,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message, status: 500 });
    }
  }

  static async putType(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const checkExists = await typeOfMoneySchema.findById(id);
      if (checkExists == null) {
        throw new Error(`Not found type of money`);
      }
      const { moneyType, job_id } = req.body;
      if (!moneyType && !job_id) {
        throw new Error(`there is no data!`);
      }
      const updatedType = await typeOfMoneySchema.findByIdAndUpdate(
        id,
        { moneyType, job_id },
        { new: true }
      );
      res.send({
        status: 200,
        message: `Type of money was updated successfuly!`,
        success: true,
        data: updatedType,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message, status: 500 });
    }
  }

  static async deleteType(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const checkExists = await typeOfMoneySchema.findById(id);
      if (checkExists == null) {
        throw new Error(`Not found type of money`);
      }
      const deletedType = await typeOfMoneySchema.findByIdAndDelete(id);
      res.send({
        status: 200,
        message: `Type of money was deleted successfuly!`,
        success: true,
        data: deletedType,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message, status: 500 });
    }
  }
}
