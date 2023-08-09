import { NextFunction, Request, Response } from 'express';
import EducationModel from '../schemas/education.schema.js'; // I assume you have an "education.schema.ts" file
import { IEducation } from '../interface/interface.js';
import userSchema from '../schemas/user.schema.js';

class EducationController {
    async createEducation(req: Request, res: Response, next: NextFunction) {
        try {
            const educationData: IEducation = req.body;
            const newEducation = await EducationModel.create(educationData);
            // Get user ID from the header or wherever you store it
            const userId = req.headers.token as string;

            // Update the user document with the new education ID
            const user = await userSchema.findByIdAndUpdate(userId, {
                $push: {
                    educations: newEducation._id,
                },
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found', status: 404 });
            }

            return res.status(201).json(newEducation);
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    async getAllEducations(req: Request, res: Response) {
        try {
            const educations = await EducationModel.find();
            return res.status(200).json(educations);
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    async getEducationById(req: Request, res: Response) {
        const educationId = req.params.id;
        try {
            const education = await EducationModel.findById(educationId);
            if (!education) {
                return res.status(404).json({ message: 'Education not found', status: 404 });
            }
            return res.status(200).json(education);
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    async updateEducation(req: Request, res: Response) {
        const educationId = req.params.id;
        try {
            const updatedEducation = await EducationModel.findByIdAndUpdate(educationId, req.body, { new: true });
            if (!updatedEducation) {
                return res.status(404).json({ message: 'Education not found', status: 404 });
            }
            return res.status(200).json(updatedEducation);
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    async deleteEducation(req: Request, res: Response) {
        const educationId = req.params.id;
        try {
            const deletedEducation = await EducationModel.findByIdAndDelete(educationId);
            if (!deletedEducation) {
                return res.status(404).json({ message: 'Education not found', status: 404 });
            }
            return res.status(200).json(deletedEducation);
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
}

export default new EducationController();
