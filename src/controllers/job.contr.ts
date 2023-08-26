import { NextFunction, Request, Response } from 'express';
import FileDataModel from '../schemas/job.schema.js';
import { ComLocationData, FileData, IFileData, IJobCategory } from '../interface/interface';
import JobCategoryModel from '../schemas/jobCategory.schema.js';
import { JWT } from '../utils/jwt.js';
import recRuiterSchema from '../schemas/recruiter.schema.js';
import Recruiter from '../schemas/recruiter.schema.js';
import Skills from '../schemas/jobSkill.schema.js';
import moneySchema from '../schemas/money.schema.js';
import infoSchema from '../schemas/info.schema.js';
class FileDataController {
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
            if (!user) return res.status(404).send({
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
            let userId = JWT.VERIFY(token).id;
            if (userId) {
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

    // FileData obyektini olish
    async getFileDataById(req: Request, res: Response) {
        const fileId = req.params.id;
        try {
            const fileData = await FileDataModel.findById(fileId)
                .populate('jobSkills jobEmployee moreInfo moneyTypeId catId employeies')
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
                .populate('jobSkills jobEmployee moreInfo moneyTypeId catId employeies')
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
    async updateFileData(req: Request, res: Response) {
        const fileId = req.params.id;
        try {
            const updatedFileData = await FileDataModel.findByIdAndUpdate(fileId, req.body, { new: true }).populate('jobSkills jobEmployee moreInfo moneyTypeId catId');
            if (!updatedFileData) {
                return res.status(404).json({ message: 'FileData topilmadi', status: 404 });
            }
            return res.status(200).json(updatedFileData);
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    // FileData obyektini o'chirish
    async deleteFileData(req: Request, res: Response) {
        const fileId = req.params.id;
        try {
            const deletedFileData = await FileDataModel.findByIdAndDelete(fileId);
            if (!deletedFileData) {
                return res.status(404).json({ message: 'FileData topilmadi', status: 404 });
            }
            return res.status(200).json(deletedFileData);
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
}

export default new FileDataController();
