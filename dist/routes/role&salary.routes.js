import { Router } from 'express';
import RoleAndSalaryController from '../controllers/role&salary.controller.js';
export const router = Router();
router.get('/', RoleAndSalaryController.getAllRoleAndSalary.bind(RoleAndSalaryController));
router.put('/', RoleAndSalaryController.updateRoleAndSalary.bind(RoleAndSalaryController));
