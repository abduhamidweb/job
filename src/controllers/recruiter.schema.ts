import { NextFunction, Request, Response } from 'express';
import FileDataModel from '../schemas/job.schema.js';
import RecruiterModel from '../schemas/recruiter.schema'; // Recruiter schema
import { IRecruiter } from '../interface/interface';

class RecruiterController {
    // Creating a new recruiter
    async createRecruiter(req: Request, res: Response, next: NextFunction) {
        try {
            const recruiterData: IRecruiter = req.body;
            const newRecruiter = await RecruiterModel.create(recruiterData);
            await newRecruiter.save();
            return res.status(201).json(newRecruiter);
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    // Getting all recruiters
    async getAllRecruiters(req: Request, res: Response) {
        try {
            const recruiters = await RecruiterModel.find().populate('posts');
            return res.status(200).json(recruiters);
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    // Getting a recruiter by ID
    async getRecruiterById(req: Request, res: Response) {
        const recruiterId = req.params.id;
        try {
            const recruiter = await RecruiterModel.findById(recruiterId).populate('posts');
            if (!recruiter) {
                return res.status(404).json({ message: 'Recruiter not found', status: 404 });
            }
            return res.status(200).json(recruiter);
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    // Updating a recruiter
    async updateRecruiter(req: Request, res: Response) {
        const recruiterId = req.params.id;
        try {
            const updatedRecruiter = await RecruiterModel.findByIdAndUpdate(recruiterId, req.body, { new: true }).populate('posts');
            if (!updatedRecruiter) {
                return res.status(404).json({ message: 'Recruiter not found', status: 404 });
            }
            await updatedRecruiter.save();
            return res.status(200).json(updatedRecruiter);
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    // Deleting a recruiter
    async deleteRecruiter(req: Request, res: Response) {
        const recruiterId = req.params.id;
        try {
            const deletedRecruiter = await RecruiterModel.findByIdAndDelete(recruiterId);
            if (!deletedRecruiter) {
                return res.status(404).json({ message: 'Recruiter not found', status: 404 });
            }
            return res.status(200).json(deletedRecruiter);
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
}

export default new RecruiterController();
