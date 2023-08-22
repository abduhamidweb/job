var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import path from "path";
import { v4 as uuidv4 } from "uuid";
import Resume from "../schemas/resume.schema.js";
import fs from 'fs';
import { JWT } from "../utils/jwt.js";
import userSchema from "../schemas/user.schema.js";
const PUBLIC_FOLDER_PATH = path.join(process.cwd(), 'src', 'public', 'resumes');
export class ResumeController {
    createResume(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.headers.token;
                if (!token)
                    return res.status(401).send({ message: 'Invalid token' });
                let userId = JWT.VERIFY(token).id;
                let user = yield userSchema.findById(userId);
                if (!user)
                    return res.status(404).send({ message: "User not found" });
                if (!req.files || Object.keys(req.files).length === 0) {
                    return res.status(400).send('No files were uploaded..');
                }
                // create a new resume
                const resumeFiles = Array.isArray(req.files) ? req.files : [req.files];
                for (const resumeFile of resumeFiles) {
                    const uniqueFilename = uuidv4() + path.extname(resumeFile.resume.name);
                    const filePath = path.join(PUBLIC_FOLDER_PATH, uniqueFilename);
                    resumeFile.resume.mv(filePath, (err) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send(err);
                        }
                    });
                    const newResume = new Resume({
                        user: user._id,
                        filePath: uniqueFilename,
                    });
                    yield newResume.save();
                    yield userSchema.findByIdAndUpdate(userId, {
                        $push: {
                            resume: newResume._id,
                        },
                    });
                    res.status(201).send({
                        messagae: "Files uploaded successfully.",
                        data: newResume
                    });
                }
            }
            catch (error) {
                console.error(error.message);
                res.status(500).send('Server error');
            }
        });
    }
    updateResume(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.headers.token;
                if (!token)
                    return res.status(401).send({ message: 'Invalid token' });
                let userId = JWT.VERIFY(token).id;
                let user = yield userSchema.findById(userId);
                if (!user)
                    return res.status(404).send({ message: "User not found" });
                if (!req.files || Object.keys(req.files).length === 0) {
                    return res.status(400).send('No files were uploaded.');
                }
                const resumeId = req.params.resumeId;
                const resume = yield Resume.findById(resumeId);
                if (!resume) {
                    return res.status(404).json({ message: "Resume not found" });
                }
                const resumeFiles = Array.isArray(req.files) ? req.files : [req.files];
                for (const resumeFile of resumeFiles) {
                    const uniqueFilename = uuidv4() + path.extname(resumeFile.resume.name);
                    const filePath = path.join(PUBLIC_FOLDER_PATH, uniqueFilename);
                    resumeFile.resume.mv(filePath, (err) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send(err);
                        }
                    });
                    const newResume = yield Resume.findByIdAndUpdate(resumeId, {
                        user: user._id,
                        filePath: uniqueFilename,
                    });
                    res.status(201).send({
                        messagae: "Files uploaded successfully.",
                        data: newResume
                    });
                }
                if (resume.filePath) {
                    const oldFilePath = path.join(PUBLIC_FOLDER_PATH, resume.filePath);
                    fs.unlinkSync(oldFilePath);
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Server error" });
            }
        });
    }
}
