import { Schema, model } from 'mongoose';
import validator from 'validator';
const FileDataSchema = new Schema({
    employees: [
        {
            type: Schema.Types.ObjectId,
            ref: "Users"
        }
    ],
    comImg: {
        type: String,
        required: true,
        validate: {
            validator: (value) => validator.isURL(value),
            message: 'Noto\'g\'ri URL formati',
        },
    },
    comName: {
        type: String,
        required: true,
    },
    comLocation: {
        type: String,
    },
    jobSave: {
        type: Boolean,
    },
    jobTitle: {
        type: String,
        required: true,
    },
    jobInfo: {
        type: String,
        required: true,
    },
    jobSkills: {
        type: Schema.Types.ObjectId,
        ref: 'Skills',
    },
    jobType: {
        type: String,
        required: true,
    },
    jobCooperate: {
        type: Boolean,
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
    moreInfo: [{
            type: Schema.Types.ObjectId,
            ref: 'MoreInfo',
        }],
    catId: {
        type: String,
        ref: "JobCategory",
    },
    moneyTypeId: {
        type: Schema.Types.ObjectId,
        ref: 'TypeOfMoney', // "TypeOfMoney" nomli boshqa modelga bog'lanish uchun ref
    },
}, { timestamps: true });
// Model yaratish
const FileDataModel = model('FileData', FileDataSchema);
export default FileDataModel;
