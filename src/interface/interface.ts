import mongoose, { Document, Types } from 'mongoose';

export interface IPost extends Document {
    title: string;
    content: string;
    user: mongoose.Types.ObjectId;
}
export // Berilgan fayldagi ma'lumotlar uchun schema interfeysi
    interface IFileData extends Document {
    comImg: string;
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