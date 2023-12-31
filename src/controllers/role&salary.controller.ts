import { Request, Response } from "express";
import RoleAndSalary from "../schemas/role&salary.schema.js";
import { IRoleAndSalary } from '../interface/interface';
import userModel from "../schemas/user.schema.js";
import { JWT } from "../utils/jwt.js";
import userSchema from "../schemas/user.schema.js";


class RoleAndSalaryController {

    public async getAllRoleAndSalary(req: Request, res: Response): Promise<void> {
        try {
            const roleAndSalary: IRoleAndSalary[] | null = await RoleAndSalary.find();

            res.status(200).json(roleAndSalary);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public async updateRoleAndSalary(req: Request, res: Response): Promise<void> {

        try {
            const token = req.headers.token as string;
            let userId = JWT.VERIFY(token as string).id;
            const { preferredRole, monthlySalary, expectedSalary }: IRoleAndSalary = req.body;

            if (!userId) {
                const errorMessage = "Bunday user IDlik malumot topilmadi";
                res.status(400).json({ message: errorMessage, status: 400 });
                return;
            }

            const user = await userModel.findById(userId);
            if (!user) {
                const errorMessage = "Bunday User Topilmadi";
                console.error(errorMessage);
                res.status(404).json({ message: errorMessage, status: 404 });
                return;
            }

            const roleAndSalaryPut = await RoleAndSalary.findOneAndUpdate({ userId }, { preferredRole, monthlySalary, expectedSalary }, { new: true });

            if (!roleAndSalaryPut) {
                const RoleAndSalaryPost = new RoleAndSalary({ preferredRole, monthlySalary, expectedSalary, userId });
                await RoleAndSalaryPost.save();
                await userSchema.findByIdAndUpdate(userId, {

                    roleAndSalary: RoleAndSalaryPost._id,

                });

                res.status(201).json("Successfully created Role and Salary");
            }
            else {
                res.status(200).json("Role and Salary succesfully edited");
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

}

export default new RoleAndSalaryController();