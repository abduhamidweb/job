import { model, Schema, Document, Types } from "mongoose";
import { IRecruiter } from "../interface/interface";
const recruiterSchema = new Schema<IRecruiter>({
    email: {
        type: String,
        required: true,
        unique: true,
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

const Recruiter = model<IRecruiter>("Recruiter", recruiterSchema);

export default Recruiter;
