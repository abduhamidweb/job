var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Skill from "../schemas/skill.schema.js";
import userSchema from "../schemas/user.schema.js";
import { JWT } from "../utils/jwt.js";
export class SkillContr {
    static postSkill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.token;
                const userId = JWT.VERIFY(token).id;
                const { skill, experience, level } = req.body;
                if (!skill || !level || !experience) {
                    throw new Error(`Data is incompleted!`);
                }
                const newType = yield Skill.create({ skill, experience, level });
                yield newType.save();
                yield userSchema.findByIdAndUpdate(userId, {
                    $push: {
                        skills: newType._id,
                    },
                });
                res.send({
                    status: 200,
                    message: `The skill was added successfuly!`,
                    success: true,
                    data: newType,
                });
            }
            catch (error) {
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    static getSkill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (id) {
                    const findById = yield Skill.findById(id);
                    if (findById == null) {
                        throw new Error(`Not Found!`);
                    }
                    else {
                        res.send({
                            status: 200,
                            message: `Found`,
                            success: true,
                            data: findById,
                        });
                    }
                }
                else {
                    res.send({
                        status: 200,
                        message: `All info`,
                        success: true,
                        data: yield Skill.find(),
                    });
                }
            }
            catch (error) {
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    static putSkill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const checkExists = yield Skill.findById(id);
                if (checkExists == null) {
                    throw new Error(`Not found the skill`);
                }
                const { skill, experience, level } = req.body;
                if (!skill && !level && !experience) {
                    throw new Error(`there is no data!`);
                }
                const updatedSkill = yield Skill.findByIdAndUpdate(id, { skill, experience, level }, { new: true });
                const userId = req.headers.token;
                res.send({
                    status: 200,
                    message: `Skill was updated successfuly!`,
                    success: true,
                    data: updatedSkill,
                });
            }
            catch (error) {
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    static deleteSkill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const checkExists = yield Skill.findById(id);
                if (checkExists == null) {
                    throw new Error(`Not found info`);
                }
                const deletedSkill = yield Skill.findByIdAndDelete(id);
                const userId = req.headers.token;
                res.send({
                    status: 200,
                    message: `Skill was deleted successfuly!`,
                    success: true,
                    data: deletedSkill,
                });
            }
            catch (error) {
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
}
