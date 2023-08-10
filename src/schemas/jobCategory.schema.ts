import { Schema, model, Document, Types } from 'mongoose';
import validator from 'validator';
import { IFileData, IJobCategory } from '../interface/interface';

// Job kategoriyasi uchun schema tuzish
const JobCategorySchema = new Schema<IJobCategory>({
    jobName: {
        type: String,
        required: true,
    },
    jobImg: {
        type: String,
        required: true,
        validate: {
            validator: (value: string) => validator.isURL(value),
            message: 'Noto\'g\'ri URL formati',
        },
    },
    jobDesc: {
        type: String,
        required: true,
    },
    jobs: [{
        type: Schema.Types.ObjectId,
        ref: 'FileData',
    }],
});

// Model yaratish
const JobCategoryModel = model<IJobCategory>('JobCategory', JobCategorySchema);

export default JobCategoryModel;
