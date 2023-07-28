import { Request, Response } from "express";
import Skills from "../schemas/jobSkill.schema.js";
import { IJobSkills } from '../interface/interface';

class SkillController {
    public async postSkill(req: Request, res: Response): Promise<void> {
        const { skillName, jobId }: IJobSkills = req.body;
        try {
            const skill = new Skills({ skillName, jobId });
            await skill.save();
            res.status(201).json("Successfully created Skill");
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
    public async getAllSkills(req: Request, res: Response): Promise<void> {
        try {
            const skills: IJobSkills[] | null = await Skills.find();

            res.status(200).json(skills);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async updateSkill(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { skillName, jobId }: IJobSkills = req.body;

        try {
            const skill = await Skills.findByIdAndUpdate(id, { skillName, jobId }, { new: true });

            if (!skill) {
                res.status(404).json({ error: 'Skill not found' });
            }
            // res.status(200).json(skill);
            res.status(200).send("Skill succesfully edited");
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async deleteSkill(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            const skill: IJobSkills | null = await Skills.findByIdAndDelete(id);

            if (!skill) {
                res.status(404).json({ error: 'Skill not found' });
            }

            res.status(200).send("Skill succesfully deleted");
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new SkillController();