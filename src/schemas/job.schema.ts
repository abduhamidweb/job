import { Schema, model, Document, Types } from 'mongoose';
import validator from 'validator';
import { IFileData } from '../interface/interface';

const FileDataSchema = new Schema<IFileData>({
    comImg: {
        type: String,
        required: true,
        validate: {
            validator: (value: string) => validator.isURL(value),
            message: 'Noto\'g\'ri URL formati',
        },
    },
    comName: {
        type: String,
        required: true,
    },
    comLocation: {
        type: String,
        required: true,
    },
    jobSave: {
        type: Boolean,
        required: true,
    },
    jobTitle: {
        type: String,
        required: true,
    },
    jobInfo: {
        type: String,
        required: true,
    },
    jobSkills: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Skill', 
        },
    ],
    jobType: {
        type: String,
        required: true,
    },
    jobCooperate: {
        type: Boolean,
        required: true,
    },
    jobPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    jobEmployee: [{
        type: Schema.Types.ObjectId,
        ref: 'Employee', 
    }],
    moreInfo:[ {
        type: Schema.Types.ObjectId,
        ref: 'MoreInfo', 
    }], 
    catId: {
        type: String,
        ref:"JobCategory",
        required: true,
    },
    moneyTypeId: {
        type: Schema.Types.ObjectId,
        ref: 'TypeOfMoney', // "TypeOfMoney" nomli boshqa modelga bog'lanish uchun ref
    },
});

// Model yaratish
const FileDataModel = model<IFileData>('FileData', FileDataSchema);

export default FileDataModel;
