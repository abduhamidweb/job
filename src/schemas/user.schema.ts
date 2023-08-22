import mongoose, { model, Schema } from "mongoose";
import { isEmailValid } from "../middleware/email.cheker.js";
import validator from "validator";
import { countries } from "country-data-list";



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
    type: String
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
    enum: {
      values: countries.all.map((e) => e.name),
      message: "Invalid nation selected",
    },
    required: false,
  },
  residence: {
    type: String,
    enum: {
      values: countries.all.map((e) => e.name),
      message: "Invalid country selected",
    },
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
  education: {
    type: [
      {
        ref: "Education",
        type: mongoose.Types.ObjectId,
        validate: {
          validator: function (value: string) {
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
      validator: function (value: string) {
        return mongoose.Types.ObjectId.isValid(value);
      },
      message: "Invalid role ID",
    },
  },
  skills: {
    type: [
      {
        ref: "Skill",
        type: mongoose.Types.ObjectId,
        validate: {
          validator: function (value: string) {
            return mongoose.Types.ObjectId.isValid(value);
          },
          message: "Invalid skill ID",
        },
      },
    ],
  },
  lang: {
    type: [
      {
        ref: "Language",
        type: mongoose.Types.ObjectId,
        validate: {
          validator: function (value: string) {
            return mongoose.Types.ObjectId.isValid(value);
          },
          message: "Invalid language ID",
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
      validator: (value: string) => {
        return validator.isURL(value)
      },
      message: "Invalid URL",
    },
  },
});

function isBoolean(value: boolean): boolean {
  return typeof value === "boolean";
}
export default model("Users", userSchema);
