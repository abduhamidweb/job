import { Router } from 'express';
import { LanguageContr } from '../controllers/language.controller.js';
import authMiddleware from '../middleware/auth.js';
const router = Router();

router.get('/', LanguageContr.getLanguage)
router.post('/',authMiddleware, LanguageContr.postLanguage)
router.put('/:id',authMiddleware, LanguageContr.putLanguage)
router.delete('/:id',authMiddleware, LanguageContr.deleteLanguage)


export default router;