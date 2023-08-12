import { Schema, model } from "mongoose";
const ExperienceSchema = new Schema({
    experience: {
        type: Number,
        required: true,
    },
    remoteExperience: {
        type: Number,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});
const Experiences = model("Experience", ExperienceSchema);
export default Experiences;
