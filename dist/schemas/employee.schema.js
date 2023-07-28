import { Schema, model } from "mongoose";
const EmployeeSchema = new Schema({
    userEmail: {
        type: String,
        required: true,
    },
    userFullName: {
        type: String,
        required: true,
    },
    resume: {
        type: String,
        required: true,
    },
    jobId: {
        type: Schema.Types.ObjectId,
        ref: "FileData",
    },
});
const Employees = model("Employee", EmployeeSchema);
export default Employees;
