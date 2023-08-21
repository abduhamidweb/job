var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import RecruiterModel from '../schemas/recruiter.schema.js'; // Recruiter schema
import { JWT } from '../utils/jwt.js';
import bcrypt from "bcrypt";
import Skill from '../schemas/skill.schema.js';
import moreinfo from '../schemas/info.schema.js';
import moneySchema from '../schemas/money.schema.js';
import JobCategoryModel from '../schemas/jobCategory.schema.js';
import userSchema from '../schemas/user.schema.js';
class RecruiterController {
    // Creating a new recruiter
    createRecruiter(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recruiterData = req.body;
                // Parolni hash qilish
                if (recruiterData.password) {
                    const hashedPassword = yield bcrypt.hash(recruiterData.password, 10);
                    recruiterData.password = hashedPassword;
                }
                else {
                    const hashedPassword = yield bcrypt.hash(process.env.SECRET_KEY, 10);
                    recruiterData.password = hashedPassword;
                }
                // Hashlangan parolni ma'lumotlar obyektiga qo'shish
                const newRecruiter = yield RecruiterModel.create(recruiterData);
                yield newRecruiter.save();
                return res.status(201).send({
                    token: JWT.SIGN({ id: newRecruiter._id }),
                    data: newRecruiter
                });
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    loginRecruiter(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const existingRecruiter = yield RecruiterModel.findOne({ email });
                if (!existingRecruiter) {
                    return res.status(401).json({ message: "Recruiter not found", status: 401 });
                }
                const token = JWT.SIGN({ id: existingRecruiter._id });
                if (!existingRecruiter.password) {
                    return res.status(401).json({ message: "Password is not set", status: 401 });
                }
                if (password) {
                    const isPasswordValid = yield bcrypt.compare(password, existingRecruiter.password);
                    if (!isPasswordValid) {
                        return res.status(401).json({ message: "Invalid password", status: 401 });
                    }
                    return res.status(200).send({
                        token: token,
                        data: existingRecruiter
                    });
                }
                else {
                    const isPasswordValid = yield bcrypt.compare(process.env.SECRET_KEY, existingRecruiter.password);
                    if (!isPasswordValid) {
                        return res.status(401).json({ message: "Invalid password", status: 401 });
                    }
                    return res.status(200).send({
                        token: token,
                        data: existingRecruiter
                    });
                }
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    // Getting all recruiters
    getAllRecruiters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recruiters = yield RecruiterModel.find()
                    .populate({
                    path: 'posts',
                    populate: [
                        { path: 'jobSkills', model: Skill },
                        { path: 'catId', model: JobCategoryModel },
                        { path: 'moneyTypeId', model: moneySchema }
                    ],
                }).exec();
                return res.status(200).json(recruiters);
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    // Getting a recruiter by ID
    getRecruiterById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const recruiterId = req.params.id;
            try {
                const recruiter = yield RecruiterModel.findById(recruiterId)
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
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    getRecruiterByToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.query.token;
                let userId = JWT.VERIFY(token).id;
                const recruiter = yield RecruiterModel.findById(userId)
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
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    // Updating a recruiter
    updateRecruiter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const recruiterId = req.params.id;
            try {
                const updatedRecruiter = yield RecruiterModel.findByIdAndUpdate(recruiterId, req.body, { new: true })
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
                yield updatedRecruiter.save();
                return res.status(200).json(updatedRecruiter);
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    // Deleting a recruiter
    deleteRecruiter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const recruiterId = req.params.id;
            try {
                const deletedRecruiter = yield RecruiterModel.findByIdAndDelete(recruiterId);
                if (!deletedRecruiter) {
                    return res.status(404).json({ message: 'Recruiter not found', status: 404 });
                }
                return res.status(200).json(deletedRecruiter);
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
}
export default new RecruiterController();
