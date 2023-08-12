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
class ExperienceController {
    postExperience(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            let userId = JWT.VERIFY(token).id;
            const { experience, remoteExperience } = req.body;
            try {
                if (!userId) {
                    const errorMessage = 'userId kiritilmagan';
                    res.status(400).json({ message: errorMessage, status: 400 });
                    return;
                }
                const user = yield userModel.findById(userId);
                if (!user) {
                    const errorMessage = 'Bunday User Topilmadi';
                    console.error(errorMessage);
                    res.status(404).json({ message: errorMessage, status: 404 });
                    return;
                }
                const experiencePost = new Experiences({ experience, remoteExperience, userId });
                yield experiencePost.save();
                res.status(201).json("Successfully created Experience");
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
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
            const { id } = req.params;
            const { experience, remoteExperience } = req.body;
            try {
                const experiencePut = yield Experiences.findByIdAndUpdate(id, { experience, remoteExperience }, { new: true });
                if (!experiencePut) {
                    res.status(404).json({ error: 'Experience not found' });
                }
                res.status(200).send("Skill succesfully edited");
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    deleteExperience(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const experience = yield Experiences.findByIdAndDelete(id);
                if (!experience) {
                    res.status(404).json({ error: 'Experience not found' });
                }
                res.status(200).send("Experience succesfully deleted");
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
export default new ExperienceController();
