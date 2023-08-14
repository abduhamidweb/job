var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Language from "../schemas/language.schema.js";
import userSchema from "../schemas/user.schema.js";
import { JWT } from "../utils/jwt.js";
export class LanguageContr {
    static postLanguage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.token;
                const userId = JWT.VERIFY(token).id;
                const { language, level } = req.body;
                if (!language || !level) {
                    throw new Error(`Data is incompleted!`);
                }
                const newType = yield Language.create({ language, level });
                yield newType.save();
                yield userSchema.findByIdAndUpdate(userId, {
                    $push: {
                        lang: newType._id,
                    },
                });
                res.send({
                    status: 200,
                    message: `The language was added successfuly!`,
                    success: true,
                    data: newType,
                });
            }
            catch (error) {
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    static getLanguage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (id) {
                    const findById = yield Language.findById(id);
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
                        data: yield Language.find(),
                    });
                }
            }
            catch (error) {
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    static putLanguage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const checkExists = yield Language.findById(id);
                if (checkExists == null) {
                    throw new Error(`Not found the language`);
                }
                const { language, level } = req.body;
                if (!language && !level) {
                    throw new Error(`there is no data!`);
                }
                const updatedLanguage = yield Language.findByIdAndUpdate(id, { language, level }, { new: true });
                const userId = req.headers.token;
                res.send({
                    status: 200,
                    message: `Language was updated successfuly!`,
                    success: true,
                    data: updatedLanguage,
                });
            }
            catch (error) {
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    static deleteLanguage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const checkExists = yield Language.findById(id);
                if (checkExists == null) {
                    throw new Error(`Not found info`);
                }
                const deletedLanguage = yield Language.findByIdAndDelete(id);
                const userId = req.headers.token;
                res.send({
                    status: 200,
                    message: `Language was deleted successfuly!`,
                    success: true,
                    data: deletedLanguage,
                });
            }
            catch (error) {
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
}
;
