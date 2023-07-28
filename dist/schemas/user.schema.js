import { model, Schema } from "mongoose";
import { isEmailValid } from "../middleware/email.cheker.js";
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
});
export default model("Users", userSchema);
