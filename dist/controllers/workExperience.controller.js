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
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.token;
                const userId = JWT.VERIFY(token).id;
                let { companyName, jobTitle, startDate, endDate, workingNow, location, description, skill, } = req.body;
                if (!(companyName && jobTitle && startDate) || !(endDate || workingNow)) {
                    return res.status(400).json({ message: "Invalid data" });
                }
                if (!["true", "false", true, false].includes(workingNow) && workingNow) {
                    return res.status(400).json({ message: "Invalid data" });
                }
                let newWE = yield new workExperience({
                    companyName,
                    jobTitle,
                    startDate,
                    endDate,
                    workingNow,
                    location,
                    description,
                    skill,
                });
                newWE.save();
                yield userSchema.findByIdAndUpdate(userId, {
                    $push: {
                        workExperience: newWE._id,
                    },
                });
                res.json(newWE);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    },
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.token;
                const userId = JWT.VERIFY(token).id;
                let user = yield userSchema
                    .findById(userId)
                    .populate({
                    path: "workExperience",
                    populate: { path: "projects" },
                });
                if (!user)
                    return res.status(403).json({ message: "User not found" });
                let { workExperience } = user;
                res.send(workExperience);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    },
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const workExperienceId = req.params.id;
                const data = yield workExperience
                    .findById(workExperienceId)
                    .populate("projects");
                res.status(200).json(data);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    },
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.token;
                const userId = JWT.VERIFY(token).id;
                const workExperienceId = req.params.id;
                let updateData = req.body;
                let exData = [
                    "companyName",
                    "jobTitle",
                    "startDate",
                    "endDate",
                    "workingNow",
                    "location",
                    "description",
                    "skill",
                ];
                const foundProperty = exData.find((property) => req.body[property]);
                if ((Object.keys(updateData).length === 0 || !foundProperty) &&
                    !req.files) {
                    return res
                        .status(400)
                        .json({ message: "No data provided for update." });
                }
                yield workExperience.findByIdAndUpdate(workExperienceId, updateData);
                let newWE = yield workExperience.findById(workExperienceId);
                yield res.json(newWE);
            }
            catch (error) {
                res.status(403).json({ message: error.message });
            }
        });
    },
    del(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.token;
                const userId = JWT.VERIFY(token).id;
                const workExperienceId = req.params.id;
                yield workExperience.findByIdAndDelete(workExperienceId);
                res.json({ message: "Work experience deleted" });
            }
            catch (error) {
                res.status(403).json({ message: error.message });
            }
        });
    },
};
