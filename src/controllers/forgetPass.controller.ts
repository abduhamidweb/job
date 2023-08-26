import { Request, Response } from "express";
import { sendConfirmationEmail } from "../utils/nodemailer.js";
import redis from "redis";
import userSchema from "../schemas/user.schema.js";
import sha256 from "sha256";

const client = redis.createClient({
  url: "redis://default:cWORnYkLiNeTFRVuauwwTN3exTNYLoDi@redis-12791.c291.ap-southeast-2-1.ec2.cloud.redislabs.com:12791",
});
client.on("connect", function () {});

client.on("error", function (error) {
  console.error("Redis serverga bog'lanishda xatolik yuz berdi:", error);
});

client.connect();
export default {
  async forgetPass(req: Request, res: Response) {
    try {
      let { email, confirmationCode, password } = req.body;

      if (!email) return res.status(400).json({ message: "Invalid data" });

      let user = await userSchema.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      if (!confirmationCode) {
        const generatedConfirmationCode = await sendConfirmationEmail(email);
        await client.set(email, generatedConfirmationCode);
        return res.json({ message: "Confirmation code sent to the email" });
      } else if (confirmationCode && !password) {
        if (confirmationCode !== (await client.get(email)))
          return res
            .status(400)
            .json({ message: "Confirmation code is wrong." });

        return res.json({ message: "ok" });
      } else if (confirmationCode && password) {
        if (confirmationCode !== (await client.get(email)))
          return res
            .status(400)
            .json({ message: "Confirmation code is wrong." });
        await userSchema.findOneAndUpdate(
          { email },
          {
            password:sha256(password),
           }
         );
         client.set(email, "");
          return res
            .json({ message: "Password updated" });
      }
    } catch (error:any) {
        return res.status(500).json({ message: error.message });
    }
  },
};
