import { JWT } from '../utils/jwt.js';
import IMoreInfo from '../interface/interface';
import Skills from '../schemas/jobSkill.schema.js';
import infoSchema from '../schemas/info.schema.js';
import Recruiter from '../schemas/recruiter.schema.js';
import FileDataModel from '../schemas/job.schema.js';
import { NextFunction, Request, Response } from 'express';
import moneySchema from '../schemas/money.schema.js';
import recRuiterSchema from '../schemas/recruiter.schema.js';
import JobCategoryModel from '../schemas/jobCategory.schema.js';
import IMoneyType, { ComLocationData, FileData, IFileData, IJobCategory } from '../interface/interface';
import userSchema from '../schemas/user.schema.js';
import { Types } from 'mongoose';
class FileDataController {
    async updateFileData(req: Request, res: Response) {
        const fileId = req.params.id;
        try {
            const token = req.headers.token as string;
            const userId = JWT.VERIFY(token).id;
            if (!userId) {
                return res.status(401).send({
                    message: "Invalid token",
                    data: userId
                });
            }

            const {
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
                jobskillsId,
                jobskills,
                typeMoneyId,
                moreInfoId,
                moreInfo,
                typeMoney
            } = req.body;

            let updatedFileData: IFileData | null = await FileDataModel.findById(fileId);

            if (!updatedFileData) {
                return res.status(404).json({ message: 'Job topilmadi', status: 404 });
            }

            const updatedFields: any = {
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

            updatedFileData = await FileDataModel.findByIdAndUpdate(fileId, updatedFields, { new: true })
                .populate('jobSkills jobEmployee moreInfo moneyTypeId catId');

            if (!updatedFileData) {
                return res.status(404).json({ message: 'Job topilmadi', status: 404 });
            }

            if (jobskills && jobskills.length) {
                const getSkills = await Skills.findById(jobskillsId);
                if (getSkills) {
                    getSkills.skillName = jobskills;
                    await getSkills.save();
                }
            }

            if (typeMoney) {
                const getMoney = await moneySchema.findById(typeMoneyId);
                if (getMoney) {
                    getMoney.moneyType = typeMoney;
                    await getMoney.save();
                }
            }

            if (moreInfo) {
                const getMoreInfo = await infoSchema.findById(moreInfoId);
                if (getMoreInfo) {
                    getMoreInfo.jobText = moreInfo;
                    await getMoreInfo.save();
                }
            }

            return res.status(200).send({
                success: true,
                data: updatedFileData
            });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    // FileData yaratish
    async createFileData(req: Request, res: Response, next: NextFunction) {
        try {
            // check token;
            let token = req.headers.token as string;
            let userId = JWT.VERIFY(token).id;
            if (!userId) return res.status(401).send({
                message: "Invalid token",
                data: userId
            });
            // get body
            let {
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
                // job skils,
                jobskills,
                // money pul birligi
                typeMoney,
                // more info
                moreInfo,
            } = req.body;
            // create job;
            const newFileData = await FileDataModel.create({
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
            await newFileData.save();
            // category add
            const jobCategory: IJobCategory | null = await JobCategoryModel.findById(catId);
            if (!jobCategory) {
                const errorMessage = 'Job kategoriyasi topilmadi';
                console.error(errorMessage);
                return res.status(404).json({ message: errorMessage, status: 404 });
            }
            jobCategory.jobs.push(newFileData._id);
            await jobCategory.save();
            // change user    
            let user = await recRuiterSchema.findByIdAndUpdate(userId, {
                $push: {
                    posts: newFileData._id
                }
            });
            if (!user)
                return res.status(404).send({
                    message: "User not found",
                    data: user
                })
            await user?.save();

            // add skils
            if (jobskills) {
                let jobSkills = await Skills.create({
                    skillName: jobskills,
                    jobId: newFileData._id
                });
                await jobSkills.save();
                let jobskillupdate = await FileDataModel.findByIdAndUpdate(newFileData, {
                    jobSkills: jobSkills._id
                })
                await jobskillupdate?.save();
            }
            // add pull add
            if (typeMoney) {

                let moneyType = await moneySchema.create({
                    moneyType: typeMoney,
                    job_id: newFileData._id
                })
                await moneyType.save();
                let jobmoneyTypeupdate = await FileDataModel.findByIdAndUpdate(newFileData, {
                    moneyTypeId: moneyType._id
                })
                await jobmoneyTypeupdate?.save();
            }
            // add more info;
            if (moreInfo) {

                let createInfo = await infoSchema.create({
                    jobText: moreInfo,
                    job_id: newFileData._id
                })
                await createInfo.save();
                let jobInfoupdate = await FileDataModel.findByIdAndUpdate(newFileData, {
                    $push: {
                        moreInfo: createInfo._id
                    }
                })
                await jobInfoupdate?.save();
            }
            //  save user;
            return res.status(201).send({
                success: true,
                data: newFileData
            });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
    // Barcha FileData obyektlarini olish
    async getAllFileData(req: Request, res: Response) {
        try {
            const token = req.headers.token as string;
            if (token) {
                let userId = JWT.VERIFY(token).id;
                const oneRecruiterJobs = await Recruiter.findById(userId).populate('posts');
                return res.status(200).json(oneRecruiterJobs);
            } else {
                const fileDataList = await FileDataModel.find().populate('jobSkills jobEmployee moneyTypeId catId');
                return res.status(200).json(fileDataList);
            }
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
    async getApplyUser(req: Request, res: Response) {
        const token = req.headers.token as string;

        try {
            if (token) {
                let userId = JWT.VERIFY(token).id;
                let jobsWithUserId = [];
                const alljobs = await FileDataModel.find().populate("employees moreInfo jobSkills moneyTypeId");
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

        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
    // FileData obyektini olish
    async getFileDataById(req: Request, res: Response) {
        const fileId = req.params.id;
        try {
            const fileData = await FileDataModel.findById(fileId)
                .populate('jobSkills jobEmployee moreInfo moneyTypeId catId employees')
            if (!fileData) {
                return res.status(404).json({ message: 'FileData topilmadi', status: 404 });
            }
            return res.status(200).json(fileData);
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
    async getFileDataByToken(req: Request, res: Response) {
        try {
            const token = req.headers.token as string;
            let fileId = JWT.VERIFY(token).id;
            const fileData = await FileDataModel.findById(fileId)
                .populate('jobSkills jobEmployee moreInfo moneyTypeId catId employees')
            if (!fileData) {
                return res.status(404).json({ message: 'FileData topilmadi', status: 404 });
            }
            return res.status(200).json(fileData);
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
    async getComLocations(req: Request, res: Response): Promise<void> {
        try {
            const fileData: ComLocationData[] = await FileDataModel.find({}, '_id comLocation');
            const comLocationsWithId: { id: string; location: string }[] = fileData.map((data) => ({
                id: data._id,
                location: data.comLocation,
            }));

            // Create a Set to store unique locations
            const uniqueLocationsSet = new Set<string>();
            const uniqueComLocationsWithId = comLocationsWithId.filter((data) => {
                if (!uniqueLocationsSet.has(data.location)) {
                    uniqueLocationsSet.add(data.location);
                    return true;
                }
                return false;
            });

            res.send(uniqueComLocationsWithId);
        } catch (error: any) {
            console.error(error.message);
            res.status(500).json({ message: error.message, status: 500 });
        }
    }

    async searchByCriteria(req: Request, res: Response): Promise<void> {
        try {
            const { comLocation, comName, jobTitle, ...restQuery } = req.query;

            let query: any = {}; // Empty object to hold the search criteria

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

            const fileData: FileData[] = await FileDataModel.find(query, '-__v').populate('jobSkills jobEmployee moneyTypeId catId');
            res.json(fileData);
        } catch (error: any) {
            console.error(error.message);
            res.status(500).json({ message: error.message, status: 500 });
        }
    }

    // okw
    // FileData obyektini tahrirlash

    // FileData obyektini o'chirish
    async deleteFileData(req: Request, res: Response) {
        const fileId = req.params.id;
        try {
            const deletedFileData = await FileDataModel.findByIdAndDelete(fileId);
            if (!deletedFileData) {
                return res.status(404).json({ message: 'Job topilmadi', status: 404 });
            }
            return res.status(200).json(deletedFileData);
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
}

export default new FileDataController();
