import { Schema, model } from "mongoose";
import { IExperience } from "../interface/interface";

const ExperienceSchema = new Schema<IExperience>({
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

const Experiences = model<IExperience>("Experience", ExperienceSchema);

export default Experiences;
