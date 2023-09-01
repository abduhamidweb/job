import { Request, Response } from "express";
import err from "../Responser/error.js";
import Users from "../schemas/user.schema.js";
import redis from "redis";
import { JWT } from "../utils/jwt.js";
import sha256 from "sha256";
import { sendConfirmationEmail } from "../utils/nodemailer.js";
import responser from "../Responser/data.js";
import data from "../Responser/data.js";
import path from "path";
import jobSchema from "../schemas/job.schema.js";
import fs from "fs";
import { Any } from "telegraf/typings/util.js";
import { client } from "../db/redis.js";
import uploader from "../utils/cloudinary.js";
let { msg, send } = responser;

// client.connect();

export default {
  async post(req: Request, res: Response) {
    try {
      let { fullName, userEmail: email, password, confirmationCode } = req.body;
      if (password) {
        if (!confirmationCode) {
          const generatedConfirmationCode = await sendConfirmationEmail(email);
          await client.set(email, generatedConfirmationCode);
          return msg(res, "Confirmation code sent to the email", 200);
        }

        if (confirmationCode !== (await client.get(email))) {
          return msg(
            res,
            "The confirmation code you entered is incorrect. Please try again.",
            400
          );
        }
      }
      let pass: string = process.env.SECRET_KEY as string;
      const user: any = new Users({
        fullName,
        email,
        password: sha256(password || pass),
      });
      await user.save();
      client.set(email, "");

      res.status(201).json({
        token: JWT.SIGN({
          id: user._id,
        }),
        data: user,
      });
    } catch (error: any) {
      err(res, error.message, 500);
    }
  },
  async getAll(req: Request, res: Response) {
    try {
      const user = await Users.find()
        .populate("education")
        .populate("resume")
        .populate("experience")
        .populate("roleAndSalary")
        .populate("skills")
        .populate("lang")
        .populate({
          path: "workExperience",
          populate: "projects",
        });

      if (!user) {
        return res.status(404).json({ message: "Users not found" });
      }
      return res.status(200).json(user);
    } catch (err) {
      console.error("Error fetching user:", err);
      res
        .status(500)
        .json({ message: "An error occurred while fetching the user" });
    }
  },
  async getOne(req: Request, res: Response) {
    try {
      const token = req.headers.token as string;
      const userId = JWT.VERIFY(token).id;
      const user = await Users.findById(userId)
        .populate("education")
        .populate("resume")
        .populate("experience")
        .populate("roleAndSalary")
        .populate("skills")
        .populate("lang")
        .populate({
          path: "workExperience",
          populate: "projects",
        });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (err) {
      console.error("Error fetching user:", err);
      res
        .status(500)
        .json({ message: "An error occurred while fetching the user" });
    }
  },
  async login(req: Request, res: Response) {
    try {
      let { userEmail: email, password } = req.body;
      let user: any = await Users.findOne({
        email,
        password: sha256(password || process.env.SECRET_KEY),
      });
      if (!user) {
        return err(res, "Email or password wrong!", 400);
      }
      send(res, {
        data: user,
        token: JWT.SIGN({
          id: user._id,
        }),
      });
    } catch (error: any) {
      err(res, error.message, 500);
    }
  },
  async put(req: Request, res: Response) {
    try {
      let token = req.headers.token as string;
      const id = JWT.VERIFY(token).id;
      let reqFiles = req.files as any;

      if (req.files && reqFiles) {
        const profilePicture: any = reqFiles.profilePicture;
        
        
        const allowedExtensions = [".jpg", ".jpeg", ".png"];

        const ext = path.extname(profilePicture.name).toLowerCase();

        if (!allowedExtensions.includes(ext)) {
          return res
            .status(400)
            .json({ message: "Only JPEG and PNG image files are allowed" });
        }
         let imgPath=await uploader( profilePicture.data,id )
        

        await Users.findByIdAndUpdate(id, { 
          profilePicture:imgPath,
        });
      }

      const updateData: {
        fullName: any;
        available: any;
        phoneNumber: any;
        linkedIn: any;
        nationality: any;
        residence: any;
        aboutyourself: any;
      } = req.body;
      const requiredProperties = [
        "fullName",
        "available",
        "resume",
        "linkedIn",
        "phoneNumber",
        "nationality",
        "residence",
        "aboutyourself",
      ];

      const foundProperty = requiredProperties.find(
        (property) => req.body[property]
      );

      if (
        (Object.keys(updateData).length === 0 || !foundProperty) &&
        !req.files
      ) {
        return err(res, "No data provided for update.", 400);
      }

      const existingData: any = await Users.findById(id);

      if (!existingData) {
        return res.status(404).json({ message: "User not found." });
      }
      for (const field in updateData) {
        if (updateData.hasOwnProperty(field)) {
          const fieldValue = updateData[field as keyof typeof updateData];

          if (fieldValue && requiredProperties.includes(field)) {
            existingData[field] = fieldValue;
          }
        }
      }
      const updatedData = await existingData.save();

      res.status(201).json({
        data: updatedData,
        message: "User successfully updated.",
      });
    } catch (error: any) {
      err(res, error.message, 500);
    }
  },
  async delete(req: Request, res: Response) {
    try {
      const token = req.headers.token as string;
      const userId = JWT.VERIFY(token).id;
      const deletedUser = await Users.findByIdAndDelete(userId);

      if (!deletedUser) {
        err(res, "User not found", 404);
      }
      msg(res, "User deleted successfully");
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async apply(req: Request, res: Response) {
    try {
      const token = req.headers.token as string;
      const userId = JWT.VERIFY(token).id;
      let { jobId } = req.body;
      if (!jobId) {
        return res.status(400).json({ message: "Invalid data", status: 400 });
      }
      let updatedJob = await jobSchema.findByIdAndUpdate(jobId, {
        $push: {
          employeies: userId,
        },
      });
      if (!updatedJob) {
        return res.status(404).json({ message: "Job not found", status: 404 });
      }

      return res.status(201).json("Sucsessfully applied");
    } catch (error: any) {
      return res.status(500).json({ error: error?.message });
    }
  },
};
