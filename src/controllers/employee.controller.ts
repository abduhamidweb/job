import { Request, Response } from "express";
import Employees from "../schemas/employee.schema.js";
import { IEmployee } from '../interface/interface';
import fileUpload, { UploadedFile } from 'express-fileupload';
import JobModel from "../schemas/job.schema.js";

class EmployeeController {
    public async postEmployee(req: Request, res: Response): Promise<void> {
        try {
            const { userEmail, userFullName, jobId }: IEmployee = req.body;

            if (!req.files || Object.keys(req.files).length === 0) {
                res.status(400).send('No files were uploaded');
            }
            else {
                const resume = req.files.resume as UploadedFile;
                console.log(resume.name);
                let resumeFile = resume.name

                resume.mv('./src/public/' + resume.name, (err) => {
                    if (err) {
                        console.error('Error saving PDF:', err);
                        return res.status(500).send('Error saving PDF');
                    }

                    console.log('PDF saved successfully!');
                });
                const employee = new Employees({ userEmail, userFullName, resume: resumeFile });
                await employee.save();

                const job = await JobModel.findById(jobId);

                if (!job) {
                    const errorMessage = 'Job kategoriyasi topilmadi';
                    console.error(errorMessage);
                    res.status(404).json({ message: errorMessage, status: 404 });
                    return;
                }
                if (job.jobEmployee) {
                    job.jobEmployee.push(employee._id);
                } else {
                    job.jobEmployee = [employee._id];
                }
                await job.save();

                res.status(201).json("Successfully created Employee");
            }

        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
    public async getAllEmployee(req: Request, res: Response): Promise<void> {
        try {
            const employees: IEmployee[] | null = await Employees.find();

            res.status(200).json(employees);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new EmployeeController();