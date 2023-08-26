var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Skills from "../schemas/jobSkill.schema.js";
class SkillController {
    // public async postSkill(req: Request, res: Response): Promise<void> {
    // const { skillName, jobId }: IJobSkills = req.body;
    // try {
    // if (!jobId) {
    // const errorMessage = 'jobId kiritilmagan';
    // res.status(400).json({ message: errorMessage, status: 400 });
    // return;
    // }
    // const job = await JobModel.findById(jobId);
    // if (!job) {
    // const errorMessage = 'Job kategoriyasi topilmadi';
    // console.error(errorMessage);
    // res.status(404).json({ message: errorMessage, status: 404 });
    // return;
    // }
    // const skill = new Skills({ skillName, jobId });
    // await skill.save();
    // if (job.jobSkills) {
    // 
    // } else {
    // job.jobSkills = [skill._id];
    // }
    // await job.save();
    // res.status(201).json("Successfully created Skill");
    // } catch (error: any) {
    // res.status(500).json({ error: error.message });
    // }
    // }
    getAllSkills(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skills = yield Skills.find();
                res.status(200).json(skills);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    updateSkill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { skillName, jobId } = req.body;
            try {
                const skill = yield Skills.findByIdAndUpdate(id, { skillName, jobId }, { new: true });
                if (!skill) {
                    res.status(404).json({ error: 'Skill not found' });
                }
                // res.status(200).json(skill);
                res.status(200).send("Skill succesfully edited");
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    deleteSkill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const skill = yield Skills.findByIdAndDelete(id);
                if (!skill) {
                    res.status(404).json({ error: 'Skill not found' });
                }
                res.status(200).send("Skill succesfully deleted");
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
export default new SkillController();
