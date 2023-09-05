import mongoose, { Document, Types } from 'mongoose';

export interface IPost extends Document {
    title: string;
    content: string;
    user: mongoose.Types.ObjectId;
}
export interface IEducation extends Document {
    name: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
}
export interface IRecruiter extends Document {
    email: string;
    companyName?: string;
    password?: string;
    website?: string;
    posts: Types.ObjectId[];
    location?: string;
    name?: string;
    phoneNumber?: string;
}
export interface IFileData extends Document {
    comImg: string;
    employees: Types.ObjectId[];
    comName: string;
    comLocation?: string;
    jobSave: boolean;
    jobTitle: string;
    jobInfo: string;
    jobSkills: Types.ObjectId; // ObjectId lar uchun ref
    jobType: string;
    jobCooperate: boolean;
    jobPrice: number;
    jobEmployee: Types.ObjectId[]; // ObjectId uchun ref
    moreInfo: Types.ObjectId[]; // ObjectId uchun ref
    catId: string;
    moneyTypeId: Types.ObjectId; // ObjectId uchun ref
}
export default interface IMoneyType extends Document {
    jobText: string;
    job_id: Types.ObjectId;
}
export default interface IMoreInfo extends Document {
    moneyType: string;
    job_id: Types.ObjectId;
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

export interface ILanguage {
    language: string;
    level: string;
}

export interface ISkill {
    skill: string;
    experience: number;
    level: string;

}
export interface IExperience extends Document {
    experience: number;
    remoteExperience: number;
    userId: mongoose.Types.ObjectId;
}

export interface IRoleAndSalary extends Document {
    preferredRole: string;
    monthlySalary: number;
    expectedSalary: number;
    userId: mongoose.Types.ObjectId;
}
export interface IResume extends Document {
    title: string;
    content: string;
    filePath: string; // Fayl manzili
    user: Types.ObjectId; // User bilan bog'liq ma'lumot
}
export interface UploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
}
