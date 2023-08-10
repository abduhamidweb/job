import { Schema, model } from "mongoose";
import { IRoleAndSalary } from "../interface/interface";

const RoleAndExperienceSchema = new Schema<IRoleAndSalary>({
    preferredRole: {
        type: String,
        required: true,
    },
    monthlySalary: {
        type: Number,
        required: true,
    },
    expectedSalary: {
        type: Number,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

const RoleAndExperience = model<IRoleAndSalary>("Role&Experience", RoleAndExperienceSchema);

export default RoleAndExperience;
