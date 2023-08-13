import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import err from "../Responser/error.js";
import Users from "../schemas/user.schema.js";
import { JWT } from "../utils/jwt.js";

export default {
  async checkBody(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, userEmail: email, password } = req.body;
      if (!fullName || !email || !password) {
        return err(res, "Invalid data", 400);
      }

      const emailCheck: any = await Users.findOne({
        email: email,
      });

      if (emailCheck) {
        return err(res, "The email is already taken", 409);
      }

      let userTest = new Users({
        fullName,
        email,
        password,
      });
      await userTest.save();

      await Users.findOneAndDelete({ email });
      next();
    } catch (error: any) {
      err(res, error.message, 400);
    }
  },
  async idChecker(req: Request, res: Response, next: NextFunction) {
    try {
      let token = req.headers.token as string;
      const id = JWT.VERIFY(token).id;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return err(res, "Invalid id", 400);
      }
      const existingProjectData = await Users.findById(id).exec();

      if (!existingProjectData) {
        return err(res, "User not found", 404);
      }
      next();
    } catch (error: any) {
      err(res, "Server error", 500);
    }
  },
  async putChecker(req: Request, res: Response, next: NextFunction) {
    try {
      let id = req.params.id;
      const { fullName, userEmail: email, password } = req.body;

      const emailCheck: any = await Users.findOne({
        email: email,
        _id: { $ne: id },
      });

      if (emailCheck) {
        return err(res, "The email is already taken", 409);
      }

      next();
    } catch (error: any) {
      return err(res, error.message, 409);
    }
  },
  async isUsersData(req: Request, res: Response, next: NextFunction) {
    try {
      let secretKey: any = process.env.SECRET_KEY;
      let { id } = req.params;
      let token: any = req.headers.token;
      if (!token) return err(res, "Forbidden", 403);
      let userId = JWT.VERIFY(token);
      if (userId.id !== id) {
        return err(res, "Forbidden", 403);
      }
      next();
    } catch (error: any) {
      return err(res, "Forbidden", 403);
    }
  }, 
};
