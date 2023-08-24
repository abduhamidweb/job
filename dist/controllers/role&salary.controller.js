var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import RoleAndSalary from "../schemas/role&salary.schema.js";
import userModel from "../schemas/user.schema.js";
import { JWT } from "../utils/jwt.js";
import userSchema from "../schemas/user.schema.js";
class RoleAndSalaryController {
    getAllRoleAndSalary(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roleAndSalary = yield RoleAndSalary.find();
                res.status(200).json(roleAndSalary);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    updateRoleAndSalary(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.token;
                let userId = JWT.VERIFY(token).id;
                const { preferredRole, monthlySalary, expectedSalary } = req.body;
                if (!userId) {
                    const errorMessage = "Bunday user IDlik malumot topilmadi";
                    res.status(400).json({ message: errorMessage, status: 400 });
                    return;
                }
                const user = yield userModel.findById(userId);
                if (!user) {
                    const errorMessage = "Bunday User Topilmadi";
                    console.error(errorMessage);
                    res.status(404).json({ message: errorMessage, status: 404 });
                    return;
                }
                const roleAndSalaryPut = yield RoleAndSalary.findOneAndUpdate({ userId }, { preferredRole, monthlySalary, expectedSalary }, { new: true });
                if (!roleAndSalaryPut) {
                    const RoleAndSalaryPost = new RoleAndSalary({ preferredRole, monthlySalary, expectedSalary, userId });
                    yield RoleAndSalaryPost.save();
                    yield userSchema.findByIdAndUpdate(userId, {
                        roleAndSalary: RoleAndSalaryPost._id,
                    });
                    res.status(201).json("Successfully created Role and Salary");
                }
                else {
                    res.status(200).json("Role and Salary succesfully edited");
                }
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
export default new RoleAndSalaryController();
