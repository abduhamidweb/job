import { Router } from 'express';
import EmployeeController from '../controllers/employee.controller.js';
import authMiddleware from '../middleware/auth.js';

export const router = Router();
router.post('/', authMiddleware,EmployeeController.postEmployee.bind(EmployeeController));
router.get('/', EmployeeController.getAllEmployee.bind(EmployeeController));