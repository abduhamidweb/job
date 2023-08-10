import { Schema, model } from "mongoose";
import { ISkill } from "../interface/interface";

const SkillSchema = new Schema<ISkill>({
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
    }
});

const Skill = model<ISkill>("Skill", SkillSchema);

export default Skill;
