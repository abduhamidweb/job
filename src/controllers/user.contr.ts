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
import fs from "fs";
let { msg, send } = responser;

const client = redis.createClient({
  url: "redis://default:cWORnYkLiNeTFRVuauwwTN3exTNYLoDi@redis-12791.c291.ap-southeast-2-1.ec2.cloud.redislabs.com:12791",
});
client.on("connect", function () {});

client.on("error", function (error) {
  console.error("Redis serverga bog'lanishda xatolik yuz berdi:", error);
});

client.connect();

export default {
  async post(req: Request, res: Response) {
    try {
      const {
        fullName,
        userEmail: email,
        password,
        role,
        confirmationCode,
      } = req.body;

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

      const user = new Users({
        fullName,
        email,
        role,
        password: sha256(password),
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
  async get(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const user = await Users.findById(userId);

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
        password: sha256(password),
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

      if (req.files && req.files.profilePicture) {
        const profilePicture: any = req.files.profilePicture;
        const allowedExtensions = [".jpg", ".jpeg", ".png"];

        const ext = path.extname(profilePicture.name).toLowerCase();

        if (!allowedExtensions.includes(ext)) {
          return res
            .status(400)
            .json({ message: "Only JPEG and PNG image files are allowed" });
        }

        const fileName = id + "." + profilePicture.mimetype.split("/")[1];
        let direction = path.join(process.cwd(), "src", "public", "images");
        const uploadPath = path.join(direction, fileName);

        fs.readdir(direction, (err, file) => {
          if (file[0] && file[0].split(".")[0] == id) {
            fs.unlinkSync(direction + "/" + file[0]);
          }
        });

        profilePicture.mv(uploadPath, (err: any) => {
          if (err) {
            return res.status(500).json({ message: err });
          }
        });
        await Users.findByIdAndUpdate(id, {
          profilePicture: "/images/" + fileName,
        });
      }

      const updateData: {
        fullName: any;
        available: any;
        nationality: any;
        residence: any;
        aboutyourself: any;
      } = req.body;
      const requiredProperties = [
        "fullName",
        "available",
        "resume",
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
      const id: string = req.params.id;
      const deletedUser = await Users.findByIdAndDelete(id);

      if (!deletedUser) {
        err(res, "User not found", 404);
      }
      msg(res, "User deleted successfully");
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};
