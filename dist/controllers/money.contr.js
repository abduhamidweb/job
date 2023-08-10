var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import FileDataModel from "../schemas/job.schema.js";
import typeOfMoneySchema from "../schemas/money.schema.js";
export class moneyContr {
    constructor() { }
    static getType(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (id) {
                    const findById = yield typeOfMoneySchema.findById(id);
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
                        message: `All types of money`,
                        success: true,
                        data: yield typeOfMoneySchema.find(),
                    });
                }
            }
            catch (error) {
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    static addType(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { moneyType, job_id } = req.body;
                if (!moneyType || !job_id) {
                    throw new Error(`Data is incompleted!`);
                }
                const newType = yield typeOfMoneySchema.create({ moneyType, job_id });
                if (job_id) {
                    // const jobCategory: IJobCategory | null = await JobCategoryModel.findById(catId);
                    const job = yield FileDataModel.findById(job_id);
                    if (job) {
                        job.moneyTypeId = newType._id;
                        yield job.save();
                    }
                    else {
                        const errorMessage = 'Job kategoriyasi topilmadi';
                        console.error(errorMessage);
                        return res.status(404).json({ message: errorMessage, status: 404 });
                    }
                }
                yield newType.save();
                res.send({
                    status: 200,
                    message: `Type of money added successfuly!`,
                    success: true,
                    data: newType,
                });
            }
            catch (error) {
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    static putType(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const checkExists = yield typeOfMoneySchema.findById(id);
                if (checkExists == null) {
                    throw new Error(`Not found type of money`);
                }
                const { moneyType, job_id } = req.body;
                if (!moneyType && !job_id) {
                    throw new Error(`there is no data!`);
                }
                const updatedType = yield typeOfMoneySchema.findByIdAndUpdate(id, { moneyType, job_id }, { new: true });
                res.send({
                    status: 200,
                    message: `Type of money was updated successfuly!`,
                    success: true,
                    data: updatedType,
                });
            }
            catch (error) {
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    static deleteType(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const checkExists = yield typeOfMoneySchema.findById(id);
                if (checkExists == null) {
                    throw new Error(`Not found type of money`);
                }
                const deletedType = yield typeOfMoneySchema.findByIdAndDelete(id);
                res.send({
                    status: 200,
                    message: `Type of money was deleted successfuly!`,
                    success: true,
                    data: deletedType,
                });
            }
            catch (error) {
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
}
