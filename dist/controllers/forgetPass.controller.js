var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { sendConfirmationEmail } from "../utils/nodemailer.js";
import redis from "redis";
import userSchema from "../schemas/user.schema.js";
import sha256 from "sha256";
const client = redis.createClient({
    url: "redis://default:cWORnYkLiNeTFRVuauwwTN3exTNYLoDi@redis-12791.c291.ap-southeast-2-1.ec2.cloud.redislabs.com:12791",
});
client.on("connect", function () { });
client.on("error", function (error) {
    console.error("Redis serverga bog'lanishda xatolik yuz berdi:", error);
});
client.connect();
export default {
    forgetPass(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, confirmationCode, password } = req.body;
                if (!email)
                    return res.status(400).json({ message: "Invalid data" });
                let user = yield userSchema.findOne({ email });
                if (!user)
                    return res.status(404).json({ message: "User not found" });
                if (!confirmationCode) {
                    const generatedConfirmationCode = yield sendConfirmationEmail(email);
                    yield client.set(email, generatedConfirmationCode);
                    return res.json({ message: "Confirmation code sent to the email" });
                }
                else if (confirmationCode && !password) {
                    if (confirmationCode !== (yield client.get(email)))
                        return res
                            .status(400)
                            .json({ message: "Confirmation code is wrong." });
                    return res.json({ message: "ok" });
                }
                else if (confirmationCode && password) {
                    if (confirmationCode !== (yield client.get(email)))
                        return res
                            .status(400)
                            .json({ message: "Confirmation code is wrong." });
                    yield userSchema.findOneAndUpdate({ email }, {
                        password: sha256(password),
                    });
                    client.set(email, "");
                    return res
                        .json({ message: "Password updated" });
                }
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    },
};
