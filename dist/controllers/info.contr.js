var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import infoSchema from "../schemas/info.schema.js";
import FileDataModel from "../schemas/job.schema.js";
export class InfoContr {
    constructor() { }
    static getInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (id) {
                    const findById = yield infoSchema.findById(id);
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
                        data: yield infoSchema.find(),
                    });
                }
            }
            catch (error) {
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    static addInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobText, job_id } = req.body;
                if (!jobText || !job_id) {
                    throw new Error(`Data is incompleted!`);
                }
                const newInfo = yield infoSchema.create({ jobText, job_id });
                if (job_id) {
                    const job = yield FileDataModel.findById(job_id);
                    if (job) {
                        job.moreInfo.push(newInfo._id);
                        yield job.save();
                    }
                    else {
                        const errorMessage = 'Job kategoriyasi topilmadi';
                        console.error(errorMessage);
                        return res.status(404).json({ message: errorMessage, status: 404 });
                    }
                }
                yield newInfo.save();
                res.send({
                    status: 200,
                    message: `Info added successfuly!`,
                    success: true,
                    data: newInfo,
                });
            }
            catch (error) {
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    static putInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const checkExists = yield infoSchema.findById(id);
                if (checkExists == null) {
                    throw new Error(`Not found info`);
                }
                const { jobText, job_id } = req.body;
                if (!jobText && !job_id) {
                    throw new Error(`there is no data!`);
                }
                const updatedInfo = yield infoSchema.findByIdAndUpdate(id, { jobText, job_id }, { new: true });
                res.send({
                    status: 200,
                    message: `Info was updated successfuly!`,
                    success: true,
                    data: updatedInfo,
                });
            }
            catch (error) {
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    static deleteInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const checkExists = yield infoSchema.findById(id);
                if (checkExists == null) {
                    throw new Error(`Not found info`);
                }
                const deletedInfo = yield infoSchema.findByIdAndDelete(id);
                res.send({
                    status: 200,
                    message: `Info was deleted successfuly!`,
                    success: true,
                    data: deletedInfo,
                });
            }
            catch (error) {
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
}
