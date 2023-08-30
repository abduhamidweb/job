import { Schema, model } from "mongoose";
const WESchema = new Schema({
    projectName: {
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
const projects = model("workProjects", WESchema);
export default projects;
