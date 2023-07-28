import { Schema, model, Types } from "mongoose";
const infoSchema = new Schema({
    jobText: {
        type: String,
        required: [true, 'Job info is required']
    },
    job_id: {
        type: Types.ObjectId,
        ref: 'Jobs'
    },
}, {
    timestamps: true,
});
export default model("MoreInfo", infoSchema);
