import { Router } from 'express';
import EmployeeController from '../controllers/employee.controller.js';

export const router = Router();
router.post('/', EmployeeController.postEmployee.bind(EmployeeController));
router.get('/', EmployeeController.getAllEmployee.bind(EmployeeController));