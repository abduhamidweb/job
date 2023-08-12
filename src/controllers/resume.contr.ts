import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import Resume from "../schemas/resume.schema.js";
import multer from "multer";
import { FileArray, UploadedFile } from "express-fileupload";
const PUBLIC_FOLDER_PATH = path.join(process.cwd(), 'src','public','resumes');
export class ResumeController {
    async updateResume(req: Request, res: Response) {
        try {
            const resumeId = req.params.resumeId;
            const resume = await Resume.findById(resumeId);
            if (!resume) {
                return res.status(404).json({ message: "Resume not found" });
            }

            const storage = multer.diskStorage({
                destination: PUBLIC_FOLDER_PATH,
                filename: function (req, file, cb) {
                    const fileName = uuidv4() + ".pdf";
                    cb(null, fileName);
                }
            });

            const upload = multer({ storage: storage }).single("resumeFile");

            upload(req, res, async (err: any) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "File upload error" });
                }

                if (resume.filePath) {
                    const oldFilePath = path.join(PUBLIC_FOLDER_PATH, resume.filePath);
                    fs.unlinkSync(oldFilePath);
                }

                const uploadedFile = req.file as Express.Multer.File;
                resume.filePath = uploadedFile.filename;
                await resume.save();

                res.json({ message: "Resume updated successfully" });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }
}
