var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Employees from "../schemas/employee.schema.js";
import JobModel from "../schemas/job.schema.js";
class EmployeeController {
    postEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userEmail, userFullName, jobId } = req.body;
                if (!req.files || Object.keys(req.files).length === 0) {
                    res.status(400).send('No files were uploaded');
                }
                else {
                    const resume = req.files.resume;
                    console.log(resume.name);
                    let resumeFile = resume.name;
                    resume.mv('./src/public/' + resume.name, (err) => {
                        if (err) {
                            console.error('Error saving PDF:', err);
                            return res.status(500).send('Error saving PDF');
                        }
                        console.log('PDF saved successfully!');
                    });
                    const employee = new Employees({ userEmail, userFullName, resume: resumeFile });
                    yield employee.save();
                    const job = yield JobModel.findById(jobId);
                    if (!job) {
                        const errorMessage = 'Job kategoriyasi topilmadi';
                        console.error(errorMessage);
                        res.status(404).json({ message: errorMessage, status: 404 });
                        return;
                    }
                    if (job.jobEmployee) {
                        job.jobEmployee.push(employee._id);
                    }
                    else {
                        job.jobEmployee = [employee._id];
                    }
                    yield job.save();
                    res.status(201).json("Successfully created Employee");
                }
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getAllEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employees = yield Employees.find();
                res.status(200).json(employees);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
export default new EmployeeController();
