import { model, Schema } from "mongoose";
const resumeSchema = new Schema({
    filePath: {
        type: String,
        required: false,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
});
const Resume = model("Resume", resumeSchema);
export default Resume;
