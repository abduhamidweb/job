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
import workExperience from "../schemas/workExperience.schema.js";
import { JWT } from "../utils/jwt.js";
export default {
    idAndUserChecker(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.token;
                const userId = JWT.VERIFY(token).id;
                const workExperienceId = req.params.id;
                const data = yield workExperience.findById(workExperienceId);
                const user = yield userSchema.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                if (!data) {
                    return res.status(404).json({ message: "Work experience not found" });
                }
                if (!user.workExperience.includes(workExperienceId)) {
                    return res.status(403).json({
                        message: "Unauthorized to update this work experience",
                    });
                }
                return next();
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    },
    idChecker(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.token;
                const userId = JWT.VERIFY(token).id;
                let userData = yield userSchema.findById(userId);
                if (!userData)
                    return res.status(403).json({ message: "User not found" });
                return next();
            }
            catch (error) {
                res.status(403).json({ message: "Invalid token" });
            }
        });
    },
};
