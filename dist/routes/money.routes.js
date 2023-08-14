import { Router } from 'express';
import { moneyContr } from '../controllers/money.contr.js';
import authMiddleware from '../middleware/auth.js';
const router = Router();
router.get('/', moneyContr.getType);
router.post('/', authMiddleware, moneyContr.addType);
router.put('/:id', authMiddleware, moneyContr.putType);
router.delete('/:id', authMiddleware, moneyContr.deleteType);
export default router;
