import mongoose, { model, Schema } from "mongoose";
import { isEmailValid } from "../middleware/email.cheker.js";
import validator from "validator";
const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "Name is required"],
        minlength: [3, "Name must be at least 3 characters long"],
        maxlength: [64, "Name cannot exceed 64 characters long"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: isEmailValid,
            message: "Invalid email address",
        },
    },
    password: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
    available: {
        type: Boolean,
        validate: {
            validator: isBoolean,
            message: "available must be a boolean value", // Custom error message
        },
    },
    resume: {
        ref: "Resume",
        type: mongoose.Types.ObjectId,
    },
    nationality: {
        type: String,
        required: false,
    },
    residence: {
        type: String,
        required: false,
    },
    aboutyourself: {
        type: String,
        maxlength: 50,
        required: false,
    },
    experience: {
        ref: "Experience",
        type: mongoose.Types.ObjectId,
    },
    workExperience: {
        type: [
            {
                ref: "workExperience",
                type: mongoose.Types.ObjectId,
            },
        ],
    },
    education: {
        type: [
            {
                ref: "Education",
                type: mongoose.Types.ObjectId,
                validate: {
                    validator: function (value) {
                        return mongoose.Types.ObjectId.isValid(value);
                    },
                    message: "Invalid education ID",
                },
            },
        ],
    },
    roleAndSalary: {
        ref: "Role&Experience",
        type: mongoose.Types.ObjectId,
        validate: {
            validator: function (value) {
                return mongoose.Types.ObjectId.isValid(value);
            },
            message: "Invalid role ID",
        },
    },
    skills: {
        type: [
            {
                type: {
                    skill: {
                        type: String,
                        required: true,
                    },
                    experience: {
                        type: Number,
                        required: true,
                    },
                    level: {
                        type: String,
                        required: true,
                    },
                },
            },
        ],
    },
    lang: {
        type: [
            {
                type: {
                    language: {
                        type: String,
                        required: true,
                    },
                    level: {
                        type: String,
                        required: true,
                    },
                },
            },
        ],
    },
    phoneNumber: {
        type: String,
    },
    linkedIn: {
        type: String,
        validate: {
            validator: (value) => {
                return validator.isURL(value);
            },
            message: "Invalid URL",
        },
    },
});
function isBoolean(value) {
    return typeof value === "boolean";
}
export default model("Users", userSchema);
