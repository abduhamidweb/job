var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { JWT } from '../utils/jwt.js';
import Skills from '../schemas/jobSkill.schema.js';
import infoSchema from '../schemas/info.schema.js';
import Recruiter from '../schemas/recruiter.schema.js';
import FileDataModel from '../schemas/job.schema.js';
import moneySchema from '../schemas/money.schema.js';
import recRuiterSchema from '../schemas/recruiter.schema.js';
import JobCategoryModel from '../schemas/jobCategory.schema.js';
import { Types } from 'mongoose';
class FileDataController {
    updateFileData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileId = req.params.id;
            try {
                const token = req.headers.token;
                const userId = JWT.VERIFY(token).id;
                if (!userId) {
                    return res.status(401).send({
                        message: "Invalid token",
                        data: userId
                    });
                }
                const { comImg, comName, comLocation, jobSave, jobTitle, jobInfo, jobType, jobCooperate, jobPrice, catId, jobskillsId, jobskills, typeMoneyId, moreInfoId, moreInfo, typeMoney } = req.body;
                let updatedFileData = yield FileDataModel.findById(fileId);
                if (!updatedFileData) {
                    return res.status(404).json({ message: 'Job topilmadi', status: 404 });
                }
                const updatedFields = {
                    comImg: comImg || updatedFileData.comImg,
                    comName: comName || updatedFileData.comName,
                    comLocation: comLocation || updatedFileData.comLocation,
                    jobSave: jobSave || updatedFileData.jobSave,
                    jobTitle: jobTitle || updatedFileData.jobTitle,
                    jobInfo: jobInfo || updatedFileData.jobInfo,
                    jobType: jobType || updatedFileData.jobType,
                    jobCooperate: jobCooperate || updatedFileData.jobCooperate,
                    jobPrice: jobPrice || updatedFileData.jobPrice,
                    catId: catId || updatedFileData.catId,
                };
                updatedFileData = yield FileDataModel.findByIdAndUpdate(fileId, updatedFields, { new: true })
                    .populate('jobSkills jobEmployee moreInfo moneyTypeId catId');
                if (!updatedFileData) {
                    return res.status(404).json({ message: 'Job topilmadi', status: 404 });
                }
                if (jobskills && jobskills.length) {
                    const getSkills = yield Skills.findById(jobskillsId);
                    if (getSkills) {
                        getSkills.skillName = jobskills;
                        yield getSkills.save();
                    }
                }
                if (typeMoney) {
                    const getMoney = yield moneySchema.findById(typeMoneyId);
                    if (getMoney) {
                        getMoney.moneyType = typeMoney;
                        yield getMoney.save();
                    }
                }
                if (moreInfo) {
                    const getMoreInfo = yield infoSchema.findById(moreInfoId);
                    if (getMoreInfo) {
                        getMoreInfo.jobText = moreInfo;
                        yield getMoreInfo.save();
                    }
                }
                return res.status(200).send({
                    success: true,
                    data: updatedFileData
                });
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    // FileData yaratish
    createFileData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check token;
                let token = req.headers.token;
                let userId = JWT.VERIFY(token).id;
                if (!userId)
                    return res.status(401).send({
                        message: "Invalid token",
                        data: userId
                    });
                // get body
                let { comImg, comName, comLocation, jobSave, jobTitle, jobInfo, jobType, jobCooperate, jobPrice, catId, 
                // job skils,
                jobskills, 
                // money pul birligi
                typeMoney, 
                // more info
                moreInfo, } = req.body;
                // create job;
                const newFileData = yield FileDataModel.create({
                    comImg,
                    comName,
                    comLocation,
                    jobSave,
                    jobTitle,
                    jobInfo,
                    jobType,
                    jobCooperate,
                    jobPrice,
                    catId,
                });
                yield newFileData.save();
                // category add
                const jobCategory = yield JobCategoryModel.findById(catId);
                if (!jobCategory) {
                    const errorMessage = 'Job kategoriyasi topilmadi';
                    console.error(errorMessage);
                    return res.status(404).json({ message: errorMessage, status: 404 });
                }
                jobCategory.jobs.push(newFileData._id);
                yield jobCategory.save();
                // change user    
                let user = yield recRuiterSchema.findByIdAndUpdate(userId, {
                    $push: {
                        posts: newFileData._id
                    }
                });
                if (!user)
                    return res.status(404).send({
                        message: "User not found",
                        data: user
                    });
                yield (user === null || user === void 0 ? void 0 : user.save());
                // add skils
                if (jobskills) {
                    let jobSkills = yield Skills.create({
                        skillName: jobskills,
                        jobId: newFileData._id
                    });
                    yield jobSkills.save();
                    let jobskillupdate = yield FileDataModel.findByIdAndUpdate(newFileData, {
                        jobSkills: jobSkills._id
                    });
                    yield (jobskillupdate === null || jobskillupdate === void 0 ? void 0 : jobskillupdate.save());
                }
                // add pull add
                if (typeMoney) {
                    let moneyType = yield moneySchema.create({
                        moneyType: typeMoney,
                        job_id: newFileData._id
                    });
                    yield moneyType.save();
                    let jobmoneyTypeupdate = yield FileDataModel.findByIdAndUpdate(newFileData, {
                        moneyTypeId: moneyType._id
                    });
                    yield (jobmoneyTypeupdate === null || jobmoneyTypeupdate === void 0 ? void 0 : jobmoneyTypeupdate.save());
                }
                // add more info;
                if (moreInfo) {
                    let createInfo = yield infoSchema.create({
                        jobText: moreInfo,
                        job_id: newFileData._id
                    });
                    yield createInfo.save();
                    let jobInfoupdate = yield FileDataModel.findByIdAndUpdate(newFileData, {
                        $push: {
                            moreInfo: createInfo._id
                        }
                    });
                    yield (jobInfoupdate === null || jobInfoupdate === void 0 ? void 0 : jobInfoupdate.save());
                }
                //  save user;
                return res.status(201).send({
                    success: true,
                    data: newFileData
                });
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    // Barcha FileData obyektlarini olish
    getAllFileData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.token;
                if (token) {
                    let userId = JWT.VERIFY(token).id;
                    const oneRecruiterJobs = yield Recruiter.findById(userId).populate('posts');
                    return res.status(200).json(oneRecruiterJobs);
                }
                else {
                    const fileDataList = yield FileDataModel.find().populate('jobSkills jobEmployee moneyTypeId catId');
                    return res.status(200).json(fileDataList);
                }
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    getApplyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.headers.token;
            try {
                if (token) {
                    let userId = JWT.VERIFY(token).id;
                    let jobsWithUserId = [];
                    const alljobs = yield FileDataModel.find().populate("employees moreInfo jobSkills moneyTypeId");
                    // userId ni tekshirib, joblarni olib beramiz:
                    const userIdObjectID = new Types.ObjectId(userId);
                    // Filter jobs by matching userId in employees array
                    for (let job of alljobs) {
                        if (job.employees.some(employeeId => employeeId.equals(userIdObjectID))) {
                            jobsWithUserId.push(job);
                        }
                    }
                    return res.status(200).json(jobsWithUserId);
                    // Print the result
                    // console.log('jobsWithUserId :', jobsWithUserId);
                    // res.send(jobsWithUserId)
                    // const recruiter = await recRuiterSchema.find()
                    //     .populate({
                    //         path: 'posts',
                    //         populate: [
                    //             { path: 'employees', model: userSchema },
                    //         ],
                    //     }).exec();
                    // console.log('recruiter :', recruiter);
                    // if (!recruiter) {
                    //     return res.status(404).json({ message: 'Recruiter not found', status: 404 });
                    // }
                    // return res.status(200).json(recruiter);
                }
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    // FileData obyektini olish
    getFileDataById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileId = req.params.id;
            try {
                const fileData = yield FileDataModel.findById(fileId)
                    .populate('jobSkills jobEmployee moreInfo moneyTypeId catId employees');
                if (!fileData) {
                    return res.status(404).json({ message: 'FileData topilmadi', status: 404 });
                }
                return res.status(200).json(fileData);
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    getFileDataByToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.token;
                let fileId = JWT.VERIFY(token).id;
                const fileData = yield FileDataModel.findById(fileId)
                    .populate('jobSkills jobEmployee moreInfo moneyTypeId catId employees');
                if (!fileData) {
                    return res.status(404).json({ message: 'FileData topilmadi', status: 404 });
                }
                return res.status(200).json(fileData);
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    getComLocations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileData = yield FileDataModel.find({}, '_id comLocation');
                const comLocationsWithId = fileData.map((data) => ({
                    id: data._id,
                    location: data.comLocation,
                }));
                // Create a Set to store unique locations
                const uniqueLocationsSet = new Set();
                const uniqueComLocationsWithId = comLocationsWithId.filter((data) => {
                    if (!uniqueLocationsSet.has(data.location)) {
                        uniqueLocationsSet.add(data.location);
                        return true;
                    }
                    return false;
                });
                res.send(uniqueComLocationsWithId);
            }
            catch (error) {
                console.error(error.message);
                res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    searchByCriteria(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = req.query, { comLocation, comName, jobTitle } = _a, restQuery = __rest(_a, ["comLocation", "comName", "jobTitle"]);
                let query = {}; // Empty object to hold the search criteria
                // Check if comLocation is provided and not equal to "all"
                if (comLocation && typeof comLocation === 'string' && comLocation.toLowerCase() !== 'all') {
                    query.comLocation = { $regex: comLocation, $options: 'i' };
                }
                // Check if comName is provided
                if (comName && typeof comName === 'string') {
                    query.comName = { $regex: comName, $options: 'i' };
                }
                // Check if jobTitle is provided
                if (jobTitle && typeof jobTitle === 'string') {
                    query.jobTitle = { $regex: jobTitle, $options: 'i' };
                }
                // Add any other parameters in restQuery to the search criteria
                Object.assign(query, restQuery);
                const fileData = yield FileDataModel.find(query, '-__v').populate('jobSkills jobEmployee moneyTypeId catId');
                res.json(fileData);
            }
            catch (error) {
                console.error(error.message);
                res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    // okw
    // FileData obyektini tahrirlash
    // FileData obyektini o'chirish
    deleteFileData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileId = req.params.id;
            try {
                const deletedFileData = yield FileDataModel.findByIdAndDelete(fileId);
                if (!deletedFileData) {
                    return res.status(404).json({ message: 'Job topilmadi', status: 404 });
                }
                return res.status(200).json(deletedFileData);
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
}
export default new FileDataController();
