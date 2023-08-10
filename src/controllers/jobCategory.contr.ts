import { Request, Response } from 'express';
import { IJobCategory } from '../interface/interface.js';
import JobCategoryModel from '../schemas/jobCategory.schema.js';
import Skills from '../schemas/jobSkill.schema.js';
import Employees from '../schemas/employee.schema.js';
import moreInfo from '../schemas/info.schema.js';
import moneyType from '../schemas/money.schema.js';

class JobCategoryController {
    // Job kategoriyasi yaratish
    async createJobCategory(req: Request, res: Response) {
        try {
            const jobCategoryData: IJobCategory = req.body;
            const newJobCategory = await JobCategoryModel.create(jobCategoryData);
            return res.status(201).json(newJobCategory);
        } catch (error: any) {
            console.error('Xatolik:', error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    // Barcha Job kategoriyalarni olish
    async getAllJobCategories(req: Request, res: Response) {
        try {
            const jobCategories = await JobCategoryModel.find()

            return res.status(200).json(jobCategories);
        } catch (error: any) {
            console.error('Xatolik:', error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    // Job kategoriyasini olish
    async getJobCategoryById(req: Request, res: Response) {
        const jobCategoryId = req.params.id;
        try {
            const jobCategory = await JobCategoryModel.findById(jobCategoryId).populate({
                path: 'jobs',
                populate: [
                    { path: 'jobSkills', model: Skills },
                    { path: 'jobEmployee', model: Employees },
                    { path: 'moreInfo', model: moreInfo },
                    // { path: 'catId', model: JobCategoryModel },
                    { path: 'moneyTypeId', model: moneyType },
                ],
            })
                .exec();
            if (!jobCategory) {
                return res.status(404).json({ message: 'Job kategoriya topilmadi', status: 404 });
            }
            return res.status(200).json(jobCategory);
        } catch (error: any) {
            console.error('Xatolik:', error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    // Job kategoriyasini tahrirlash
    async updateJobCategory(req: Request, res: Response) {
        const jobCategoryId = req.params.id;
        try {
            const updatedJobCategory = await JobCategoryModel.findByIdAndUpdate(
                jobCategoryId,
                req.body,
                { new: true }
            ).populate('jobs');
            if (!updatedJobCategory) {
                return res.status(404).json({ message: 'Job kategoriya topilmadi', status: 404 });
            }
            return res.status(200).json(updatedJobCategory);
        } catch (error: any) {
            console.error('Xatolik:', error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    // Job kategoriyasini o'chirish
    async deleteJobCategory(req: Request, res: Response) {
        const jobCategoryId = req.params.id;
        try {
            const deletedJobCategory = await JobCategoryModel.findByIdAndDelete(jobCategoryId);
            if (!deletedJobCategory) {
                return res.status(404).json({ message: 'Job kategoriya topilmadi', status: 404 });
            }
            return res.status(200).json(deletedJobCategory);
        } catch (error: any) {
            console.error('Xatolik:', error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
}

export default new JobCategoryController();
