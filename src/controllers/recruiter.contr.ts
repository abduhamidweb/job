import { NextFunction, Request, Response } from 'express';
import RecruiterModel from '../schemas/recruiter.schema.js'; // Recruiter schema
import { IRecruiter } from '../interface/interface.js';
import { JWT } from '../utils/jwt.js';
import bcrypt from "bcrypt";
import Skill from '../schemas/skill.schema.js';
import moreinfo from '../schemas/info.schema.js';
import moneySchema from '../schemas/money.schema.js';
import JobCategoryModel from '../schemas/jobCategory.schema.js';
import userSchema from '../schemas/user.schema.js';

class RecruiterController {
    // Creating a new recruiter
    async createRecruiter(req: Request, res: Response, next: NextFunction) {
        try {
            const recruiterData: IRecruiter = req.body;

            // Parolni hash qilish
            if (recruiterData.password) {
                const hashedPassword = await bcrypt.hash(recruiterData.password, 10);
                recruiterData.password = hashedPassword;
            } else {
                const hashedPassword = await bcrypt.hash(process.env.SECRET_KEY as string, 10);
                recruiterData.password = hashedPassword;
            }
            // Hashlangan parolni ma'lumotlar obyektiga qo'shish
            const newRecruiter = await RecruiterModel.create(recruiterData);
            await newRecruiter.save();

            return res.status(201).send({
                token: JWT.SIGN({ id: newRecruiter._id }),
                data: newRecruiter
            });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    } 
    async loginRecruiter(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const existingRecruiter = await RecruiterModel.findOne({ email });
            if (!existingRecruiter) {
                return res.status(401).json({ message: "Recruiter not found", status: 401 });
            }
            const token = JWT.SIGN({ id: existingRecruiter._id });
            if (!existingRecruiter.password) {
                return res.status(401).json({ message: "Password is not set", status: 401 });
            }
            
            if (password) {
                const isPasswordValid = await bcrypt.compare(password, existingRecruiter.password);
                if (!isPasswordValid) {
                    return res.status(401).json({ message: "Invalid password", status: 401 });
                }
                return res.status(200).send({
                    token: token,
                    data: existingRecruiter
                });
            } else {
                const isPasswordValid = await bcrypt.compare(process.env.SECRET_KEY as string, existingRecruiter.password);
                if (!isPasswordValid) {
                    return res.status(401).json({ message: "Invalid password", status: 401 });
                }
                return res.status(200).send({
                    token: token,
                    data: existingRecruiter
                });
            }
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
    // Getting all recruiters
    async getAllRecruiters(req: Request, res: Response) {
        try {
            const recruiters = await RecruiterModel.find()
                .populate({
                    path: 'posts',
                    populate: [
                        { path: 'jobSkills', model: Skill },
                        { path: 'catId', model: JobCategoryModel },
                        { path: 'moneyTypeId', model: moneySchema }
                    ],
                }).exec();
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
            const recruiter = await RecruiterModel.findById(recruiterId)
                .populate({
                    path: 'posts',
                    populate: [
                        { path: 'employeies', model: userSchema },
                        { path: 'jobSkills', model: Skill },
                        { path: 'catId', model: JobCategoryModel },
                        { path: 'moreInfo', model: moreinfo },
                        { path: 'moneyTypeId', model: moneySchema }
                    ],
                }).exec();
            if (!recruiter) {
                return res.status(404).json({ message: 'Recruiter not found', status: 404 });
            }
            return res.status(200).json(recruiter);
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
    async getRecruiterByToken(req: Request, res: Response) {
        try {
            let token = req.query.token as string;
            let userId = JWT.VERIFY(token as string).id
            const recruiter = await RecruiterModel.findById(userId)
                .populate({
                    path: 'posts',
                    populate: [
                        { path: 'employeies', model: userSchema },
                        { path: 'jobSkills', model: Skill },
                        { path: 'catId', model: JobCategoryModel },
                        { path: 'moreInfo', model: moreinfo },
                        { path: 'moneyTypeId', model: moneySchema }
                    ], 
                }).exec();
            if (!recruiter) {
                return res.status(404).json({ message: 'Recruiter not found', status: 404 });
            }
            res.status(200).json(recruiter);
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
    // Updating a recruiter
    async updateRecruiter(req: Request, res: Response) {
        const recruiterId = req.params.id;
        try {
            const updatedRecruiter = await RecruiterModel.findByIdAndUpdate(recruiterId, req.body, { new: true })
                .populate({
                    path: 'posts',
                    populate: [
                        { path: 'jobSkills', model: Skill },
                        { path: 'employeies', model: userSchema },
                        { path: 'catId', model: JobCategoryModel },
                        { path: 'moreInfo', model: moreinfo },
                        { path: 'moneyTypeId', model: moneySchema }
                    ],
                }).exec();
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
