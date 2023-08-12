import { model, Schema, Document, Types } from "mongoose";
import { IResume } from "../interface/interface";
const resumeSchema = new Schema<IResume>({
    filePath: {
        type: String,
        required: false,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "Users", // "Users" o'rniga "User"
        required: true,
    },
});

const Resume = model<IResume>("Resume", resumeSchema);
export default Resume;
