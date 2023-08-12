import { Router } from 'express';
import { InfoContr } from '../controllers/info.contr.js';
import authMiddleware from '../middleware/auth.js';
const router = Router();

router.get('/', InfoContr.getInfo)
router.post('/',authMiddleware, InfoContr.addInfo)
router.put('/:id', authMiddleware,InfoContr.putInfo)
router.delete('/:id',authMiddleware, InfoContr.deleteInfo)


export default router;