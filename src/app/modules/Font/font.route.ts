import { Router } from 'express';
import { upload } from '../../lib';
import { FontController } from './font.controller';

const router = Router();

router
  .route('/')
  .post(upload.single('file'), FontController.saveFont)
  .get(FontController.fetchFonts);

router.route('/:id').delete(FontController.removeFont);

export const FontRoutes = router;
