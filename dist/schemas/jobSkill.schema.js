import { Schema, model } from 'mongoose';
const SkillSchema = new Schema({
    skillName: [
        {
            type: String,
            required: true,
        },
    ],
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'FileData',
    }
}, { timestamps: true });
const Skills = model('Skills', SkillSchema);
export default Skills;
