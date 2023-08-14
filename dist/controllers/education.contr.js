var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import EducationModel from '../schemas/education.schema.js'; // I assume you have an "education.schema.ts" file
import userSchema from '../schemas/user.schema.js';
import { JWT } from '../utils/jwt.js';
class EducationController {
    createEducation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const educationData = req.body;
                const newEducation = yield EducationModel.create(educationData);
                // Get user ID from the header or wherever you store it
                const token = req.headers.token;
                const userId = JWT.VERIFY(token).id;
                // Update the user document with the new education ID
                const user = yield userSchema.findByIdAndUpdate(userId, {
                    $push: {
                        education: newEducation._id,
                    },
                });
                if (!user) {
                    return res.status(404).json({ message: 'User not found', status: 404 });
                }
                return res.status(201).json(newEducation);
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    getAllEducations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const educations = yield EducationModel.find();
                return res.status(200).json(educations);
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    getEducationById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const educationId = req.params.id;
            try {
                const education = yield EducationModel.findById(educationId);
                if (!education) {
                    return res.status(404).json({ message: 'Education not found', status: 404 });
                }
                return res.status(200).json(education);
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    updateEducation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const educationId = req.params.id;
            try {
                const updatedEducation = yield EducationModel.findByIdAndUpdate(educationId, req.body, { new: true });
                if (!updatedEducation) {
                    return res.status(404).json({ message: 'Education not found', status: 404 });
                }
                return res.status(200).json(updatedEducation);
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    deleteEducation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const educationId = req.params.id;
            try {
                const deletedEducation = yield EducationModel.findByIdAndDelete(educationId);
                if (!deletedEducation) {
                    return res.status(404).json({ message: 'Education not found', status: 404 });
                }
                return res.status(200).json(deletedEducation);
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
}
export default new EducationController();
