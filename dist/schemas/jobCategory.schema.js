import { Schema, model } from 'mongoose';
import validator from 'validator';
// Job kategoriyasi uchun schema tuzish
const JobCategorySchema = new Schema({
    jobName: {
        type: String,
        required: true,
    },
    jobImg: {
        type: String,
        required: true,
        validate: {
            validator: (value) => validator.isURL(value),
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
const JobCategoryModel = model('JobCategory', JobCategorySchema);
export default JobCategoryModel;
