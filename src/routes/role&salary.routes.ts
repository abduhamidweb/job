import { Router } from 'express';
import RoleAndSalaryController from '../controllers/role&salary.controller.js';

export const router = Router();

router.post('/', RoleAndSalaryController.postRoleAndSalary.bind(RoleAndSalaryController));
router.get('/', RoleAndSalaryController.getAllRoleAndSalary.bind(RoleAndSalaryController));
router.put('/:id', RoleAndSalaryController.updateRoleAndSalary.bind(RoleAndSalaryController));
router.delete('/:id', RoleAndSalaryController.deleteRoleAndSalary.bind(RoleAndSalaryController));
