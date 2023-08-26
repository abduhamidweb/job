import { Schema, model } from 'mongoose';
import { IJobSkills } from '../interface/interface';

const SkillSchema = new Schema<IJobSkills>({
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

const Skills = model<IJobSkills>('Skills', SkillSchema);

export default Skills;
