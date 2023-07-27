import { Router } from 'express';
import { InfoContr } from '../controllers/info.contr.js';
const router = Router();

router.get('/', InfoContr.getInfo)
router.post('/', InfoContr.addInfo)
router.put('/:id', InfoContr.putInfo)
router.delete('/:id', InfoContr.deleteInfo)


export default router;