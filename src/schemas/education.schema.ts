import { model, Schema, Document } from "mongoose";
import { IEducation } from "../interface/interface";
const educationSchema = new Schema<IEducation>({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [3, "Name must be at least 3 characters long"],
        maxlength: [64, "Name cannot exceed 64 characters long"],
    },
    degree: {
        type: String,
        required: [true, "Degree is required"],
    },
    fieldOfStudy: {
        type: String,
        required: [true, "Field of study is required"],
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"],
    },
    endDate: {
        type: Date,
        required: [true, "End date is required"],
    },
});

const EducationModel = model<IEducation>("Education", educationSchema);

export default EducationModel;
