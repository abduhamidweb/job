import { Request, Response } from "express";
import Language from "../schemas/language.schema";

export class LanguageContr {
  static async postLanguage(req: Request, res: Response) {
    try {
      const { language, level } = req.body;
      if (!language || !level) {
        throw new Error(`Data is incompleted!`);
      }
      const newType = await Language.create({ language, level });
      await newType.save();
      res.send({
        status: 200,
        message: `The language was added successfuly!`,
        success: true,
        data: newType,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message, status: 500 });
    }
  }

  static async getLanguage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (id) {
        const findById = await Language.findById(id);
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
          data: await Language.find(),
        });
      }
    } catch (error: any) {
      return res.status(500).json({ message: error.message, status: 500 });
    }
  }

  static async putLanguage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const checkExists = await Language.findById(id);
      if (checkExists == null) {
        throw new Error(`Not found the language`);
      }
      const { language, level } = req.body;
      if (!language && !level) {
        throw new Error(`there is no data!`);
      }
      const updatedLanguage = await Language.findByIdAndUpdate(
        id,
        { language, level },
        { new: true }
      );
      res.send({
        status: 200,
        message: `Language was updated successfuly!`,
        success: true,
        data: updatedLanguage,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message, status: 500 });
    }
  }

  static async deleteLanguage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const checkExists = await Language.findById(id);
      if (checkExists == null) {
        throw new Error(`Not found info`);
      }
      const deletedLanguage = await Language.findByIdAndDelete(id);
      res.send({
        status: 200,
        message: `Language was deleted successfuly!`,
        success: true,
        data: deletedLanguage,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message, status: 500 });
    }
  }
};
