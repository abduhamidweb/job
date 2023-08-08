import mongoose, { Document, Types } from 'mongoose';

export interface IPost extends Document {
    title: string;
    content: string;
    user: mongoose.Types.ObjectId;
}
export  interface IFileData extends Document {
    comImg: string;
    employeies: Types.ObjectId[];
    comName: string;
    comLocation: string;
    jobSave: boolean;
    jobTitle: string;
    jobInfo: string;
    jobSkills: Types.ObjectId[]; // ObjectId lar uchun ref
    jobType: string;
    jobCooperate: boolean;
    jobPrice: number;
    jobEmployee: Types.ObjectId[]; // ObjectId uchun ref
    moreInfo: Types.ObjectId[]; // ObjectId uchun ref
    catId: string;
    moneyTypeId: Types.ObjectId; // ObjectId uchun ref
}
export interface IJobCategory extends Document {
    jobName: string;
    jobImg: string;
    jobDesc: string;
    jobs: Types.Array<Types.ObjectId> | IFileData[];
}
export interface ComLocationData {
    _id: string;
    comLocation: string;
}
export interface FileData {
    _id: string;
    comName: string;
    comLocation: string;
    jobTitle: string;
    jobSkills: string[];
    jobPrice: number;
    location: string;
}
export interface IJobSkills extends Document {
    skillName: string;
    jobId: mongoose.Types.ObjectId;
}

export interface IEmployee extends Document {
    userEmail: string;
    userFullName: string;
    resume: string;
    jobId: mongoose.Types.ObjectId;
}