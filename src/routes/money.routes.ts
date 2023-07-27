import { Router } from 'express';
import { moneyContr } from '../controllers/money.contr.js';
const router = Router();

router.get('/', moneyContr.getType)
router.post('/', moneyContr.addType)
router.put('/:id', moneyContr.putType)
router.delete('/:id', moneyContr.deleteType)


export default router;