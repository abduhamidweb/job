import { Schema, model } from "mongoose";
const SkillSchema = new Schema({
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
const Skill = model("Skill", SkillSchema);
export default Skill;
