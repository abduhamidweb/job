import { Request, Response } from "express";
import err from "../Responser/error.js";
import Users from "../schemas/user.schema.js";
import redis from "redis";
import { JWT } from "../utils/jwt.js";
import sha256 from "sha256";
import { sendConfirmationEmail } from "../utils/nodemailer.js";
import responser from "../Responser/data.js";
import data from "../Responser/data.js";
let { msg, send } = responser;

const client = redis.createClient({
  url: "redis://default:cWORnYkLiNeTFRVuauwwTN3exTNYLoDi@redis-12791.c291.ap-southeast-2-1.ec2.cloud.redislabs.com:12791",
});
client.on("connect", function () { });

client.on("error", function (error) {
  console.error("Redis serverga bog'lanishda xatolik yuz berdi:", error);
});

client.connect();

export default {
  async post(req: Request, res: Response) {
    try {
      const {
        fullName,
        userName,
        userEmail: email,
        password,
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
        userName,
        email,
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
      const id = req.params.id;
      const updateData = req.body;

      if (Object.keys(updateData).length === 0) {
        return err(res, "No data provided for update.", 400);
      }

      const existingData: any = await Users.findById(id);

      if (!existingData) {
        return res.status(404).json({ message: "User not found." });
      }
      for (const field in updateData) {
        isNaN(updateData[field])
          ? (updateData[field] = updateData[field].trim())
          : "";
        if (
          updateData[field] !== undefined &&
          updateData[field] !== null &&
          updateData[field] !== ""
        ) {
          if (field == "password") {
            existingData[field] = sha256(updateData[field]);
          } else if (field == "userEmail") {
            existingData.email = updateData[field];
          } else {
            existingData[field] = updateData[field];
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
