import { Router } from 'express';
import { LanguageContr } from '../controllers/language.controller.js';
const router = Router();

router.get('/', LanguageContr.getLanguage)
router.post('/', LanguageContr.postLanguage)
router.put('/:id', LanguageContr.putLanguage)
router.delete('/:id', LanguageContr.deleteLanguage)


export default router;