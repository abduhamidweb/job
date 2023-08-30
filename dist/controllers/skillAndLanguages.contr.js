var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import userSchema from "../schemas/user.schema.js";
import { JWT } from "../utils/jwt.js";
export default {
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.headers.token;
                const userId = JWT.VERIFY(token).id;
                let { skills, language } = req.body;
                if (!skills || !language)
                    return res.status(400).json({ message: "Invalid data" });
                yield userSchema.findByIdAndUpdate(userId, {
                    lang: language,
                    skills
                });
                res.json(yield userSchema.findById(userId));
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    },
};
