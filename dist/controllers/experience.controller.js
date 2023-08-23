var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Experiences from "../schemas/experience.schema.js";
import userModel from "../schemas/user.schema.js";
import { JWT } from "../utils/jwt.js";
import userSchema from "../schemas/user.schema.js";
class ExperienceController {
    getAllExperience(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const experiences = yield Experiences.find();
                res.status(200).json(experiences);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    updateExperience(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.token;
                let userId = JWT.VERIFY(token).id;
                const { experience, remoteExperience } = req.body;
                if (!userId) {
                    const errorMessage = "Bunday user IDlik malumot topilmadi";
                    res.status(400).json({ message: errorMessage, status: 400 });
                    return;
                }
                const user = yield userModel.findById(userId);
                if (!user) {
                    const errorMessage = "Bunday User Topilmadi";
                    console.error(errorMessage);
                    res.status(404).json({ message: errorMessage, status: 404 });
                    return;
                }
                console.log(userId);
                const experiencePut = yield Experiences.findOneAndUpdate({ userId }, { experience, remoteExperience }, { new: true });
                console.log(experiencePut);
                if (!experiencePut) {
                    const experiencePost = new Experiences({
                        experience,
                        remoteExperience,
                        userId,
                    });
                    yield experiencePost.save();
                    yield userSchema.findByIdAndUpdate(userId, {
                        experience: experiencePost._id,
                    });
                    res.status(201).json("Successfully created Experience");
                }
                else {
                    res.status(200).json("Experience succesfully edited");
                }
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
export default new ExperienceController();
