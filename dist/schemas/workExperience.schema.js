import { Schema, model } from "mongoose";
const WESchema = new Schema({
    companyName: {
        type: String,
        required: true,
    },
    jobTitle: {
        type: String,
        required: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
    },
    workingNow: {
        type: Boolean,
        message: "Working now must be boolean",
    },
    location: {
        type: String,
    },
    description: {
        type: String,
    },
    skill: {
        type: [
            {
                type: String,
            },
        ],
    },
});
const workExperience = model("workExperience", WESchema);
export default workExperience;
