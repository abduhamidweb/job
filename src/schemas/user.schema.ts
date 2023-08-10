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
  userName: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, "Username must be at least 5 characters long"],
    maxlength: [32, "Username cannot exceed 32 characters"],
    match: [/^[A-Za-z0-9]+$/, "Username can only contain letters and numbers"],
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
    required: true,
  },
  profilePicture: {
    type: String,
    validate: {
      validator: validator.isURL,
      message: "Invalid image",
    },
  },
  available: {
    type: Boolean,
    validate: {
      validator: isBoolean,
      message: "available must be a boolean value", // Custom error message
    },
  },
  resume: {
    type: String,
    validate: {
      validator: validator.isURL,
      message: "Invalid resume",
    },
  },
  nationality: {
    type: String,
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
    ref: "experiences",
    type: mongoose.Types.ObjectId,
  },
  education: {
    type: [
      {
        ref: "educations",
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
    type: [
      {
        ref: "role&experiences",
        type: mongoose.Types.ObjectId,
        validate: {
          validator: function (value: string) {
            return mongoose.Types.ObjectId.isValid(value);
          },
          message: "Invalid role ID",
        },
      },
    ],
  },
  skills: {
    type: [
      {
        ref: "skills",
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
});

function isBoolean(value: boolean): boolean {
  return typeof value === "boolean";
}
export default model("Users", userSchema);
