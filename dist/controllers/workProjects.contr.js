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
import workProject from "../schemas/workProjects.schema.js";
import { JWT } from "../utils/jwt.js";
export default {
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let workId = req.params.id;
                let { projectName, startDate, endDate, workingNow, description, skill } = req.body;
                if (!(projectName && startDate) || !(endDate || workingNow)) {
                    return res.status(400).json({ message: "Invalid data" });
                }
                if (!["true", "false", true, false].includes(workingNow) && workingNow) {
                    return res.status(400).json({ message: "Invalid data" });
                }
                let newWP = yield new workProject({
                    projectName,
                    startDate,
                    endDate,
                    workingNow,
                    description,
                    skill,
                });
                newWP.save();
                yield workExperience.findByIdAndUpdate(workId, {
                    $push: {
                        projects: newWP._id,
                    },
                });
                res.json(newWP);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    },
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let projectId = req.params.id;
                let projectData = yield workProject.findById(projectId);
                if (!projectData)
                    return res.status(404).json({ message: "Project not found." });
                return res.status(200).json(projectData);
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
                let userData = yield userSchema.findById(userId).populate({
                    path: "workExperience",
                    populate: {
                        path: "projects",
                        model: "workProjects",
                    },
                });
                let projectData = [].concat(...userData.workExperience.map((e) => e.projects));
                if (!projectData.length)
                    return res.status(404).json({ message: "Projects not found." });
                return res.status(200).json(projectData);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    },
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let projectId = req.params.id;
                let exData = [
                    "projectName",
                    "startDate",
                    "endDate",
                    "workingNow",
                    "description",
                    "skill",
                ];
                const foundProperty = exData.find((property) => req.body[property]);
                if (Object.keys(req.body).length === 0 || !foundProperty) {
                    return res
                        .status(400)
                        .json({ message: "No data provided for update." });
                }
                yield workProject.findByIdAndUpdate(projectId, req.body);
                let projectData = yield workProject.findById(projectId);
                console.log(projectId);
                res.json(projectData);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    },
    del(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const projectId = req.params.id;
                yield workProject.findByIdAndDelete(projectId);
                res.json({ message: "Work project deleted" });
            }
            catch (error) {
                res.status(403).json({ message: error.message });
            }
        });
    },
};
