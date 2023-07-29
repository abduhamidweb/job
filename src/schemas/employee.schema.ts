import { Schema, model } from "mongoose";
import { IEmployee } from "../interface/interface";

const EmployeeSchema = new Schema<IEmployee>({
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
    jobId:
    {
        type: Schema.Types.ObjectId,
        ref: "FileData",
    },

});

const Employees = model<IEmployee>("Employee", EmployeeSchema);

export default Employees;
