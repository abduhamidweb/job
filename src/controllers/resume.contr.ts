import path from "path";
import { v4 as uuidv4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import Resume from "../schemas/resume.schema.js";
import multer from "multer";
import fileUpload, { UploadedFile } from "express-fileupload";
import fs from 'fs';
import { JWT } from "../utils/jwt.js";
import userSchema from "../schemas/user.schema.js";
const PUBLIC_FOLDER_PATH = path.join(process.cwd(), 'src', 'public', 'resumes');
export class ResumeController {
    async createResume(req: Request, res: Response) {
        try { 
            let token = req.headers.token;
            if (!token) return res.status(401).send({ message: 'Invalid token' });
            let userId = JWT.VERIFY(token as string).id
            let user = await userSchema.findById(userId);
            if (!user) return res.status(404).send({ message: "User not found" });
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send('No files were uploaded..');
            }
            // create a new resume
            const resumeFiles = Array.isArray(req.files) ? req.files : [req.files] as any[];
            for (const resumeFile of resumeFiles) {
                const uniqueFilename = uuidv4() + path.extname((resumeFile.resume as UploadedFile).name);
                const filePath = path.join(PUBLIC_FOLDER_PATH, uniqueFilename);
                (resumeFile.resume as UploadedFile).mv(filePath, (err: any) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send(err);
                    }
                });


                const newResume = new Resume({
                    user: user._id,
                    filePath: uniqueFilename,
                });
                await newResume.save();
                await userSchema.findByIdAndUpdate(userId, {
                    $push: {
                        resume: newResume._id,
                    },
                });
                res.status(201).send({
                    messagae: "Files uploaded successfully.",
                    data: newResume
                });
            }

        } catch (error: any) {
            console.error(error.message);
            res.status(500).send('Server error');
        }
    }
    async updateResume(req: Request, res: Response) {
        try {
            let token = req.headers.token;
            if (!token) return res.status(401).send({ message: 'Invalid token' });
            let userId = JWT.VERIFY(token as string).id
            let user = await userSchema.findById(userId);
            if (!user) return res.status(404).send({ message: "User not found" });
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send('No files were uploaded.');
            }
            const resumeId = req.params.resumeId;

            const resume = await Resume.findById(resumeId);
            if (!resume) {
                return res.status(404).json({ message: "Resume not found" });
            }
            const resumeFiles = Array.isArray(req.files) ? req.files : [req.files] as any[];
            for (const resumeFile of resumeFiles) {
                const uniqueFilename = uuidv4() + path.extname((resumeFile.resume as UploadedFile).name)
                const filePath = path.join(PUBLIC_FOLDER_PATH, uniqueFilename);
                (resumeFile.resume as UploadedFile).mv(filePath, (err: any) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send(err);
                    }
                });
                const newResume = await Resume.findByIdAndUpdate(resumeId, {
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
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }
}
