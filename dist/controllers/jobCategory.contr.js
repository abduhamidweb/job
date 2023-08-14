var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import JobCategoryModel from '../schemas/jobCategory.schema.js';
import Skills from '../schemas/jobSkill.schema.js';
import Employees from '../schemas/employee.schema.js';
import moreInfo from '../schemas/info.schema.js';
import moneyType from '../schemas/money.schema.js';
class JobCategoryController {
    // Job kategoriyasi yaratish
    createJobCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobCategoryData = req.body;
                const newJobCategory = yield JobCategoryModel.create(jobCategoryData);
                return res.status(201).json(newJobCategory);
            }
            catch (error) {
                console.error('Xatolik:', error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    // Barcha Job kategoriyalarni olish
    getAllJobCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobCategories = yield JobCategoryModel.find();
                return res.status(200).json(jobCategories);
            }
            catch (error) {
                console.error('Xatolik:', error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    // Job kategoriyasini olish
    getJobCategoryById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const jobCategoryId = req.params.id;
            try {
                const jobCategory = yield JobCategoryModel.findById(jobCategoryId)
                    .populate({
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
            }
            catch (error) {
                console.error('Xatolik:', error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    // Job kategoriyasini tahrirlash
    updateJobCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const jobCategoryId = req.params.id;
            try {
                const updatedJobCategory = yield JobCategoryModel.findByIdAndUpdate(jobCategoryId, req.body, { new: true }).populate('jobs');
                if (!updatedJobCategory) {
                    return res.status(404).json({ message: 'Job kategoriya topilmadi', status: 404 });
                }
                return res.status(200).json(updatedJobCategory);
            }
            catch (error) {
                console.error('Xatolik:', error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    // Job kategoriyasini o'chirish
    deleteJobCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const jobCategoryId = req.params.id;
            try {
                const deletedJobCategory = yield JobCategoryModel.findByIdAndDelete(jobCategoryId);
                if (!deletedJobCategory) {
                    return res.status(404).json({ message: 'Job kategoriya topilmadi', status: 404 });
                }
                return res.status(200).json(deletedJobCategory);
            }
            catch (error) {
                console.error('Xatolik:', error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
}
export default new JobCategoryController();
