import { Schema, model } from "mongoose";
const RoleAndExperienceSchema = new Schema({
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
const RoleAndExperience = model("Role&Experience", RoleAndExperienceSchema);
export default RoleAndExperience;
