import { model, Schema } from "mongoose";
const recruiterSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    companyName: {
        type: String,
        required: true,
    },
    website: {
        type: String,
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: "FileData",
        },
    ],
    location: {
        type: String,
    },
    name: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
});
const Recruiter = model("Recruiter", recruiterSchema);
export default Recruiter;
