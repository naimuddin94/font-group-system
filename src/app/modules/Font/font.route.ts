import { Router } from 'express';
import { upload } from '../../lib';
import { FontController } from './font.controller';

const router = Router();

router
  .route('/')
  .post(upload.single('file'), FontController.saveFont)
  .get(FontController.fetchFonts);

export const FontRoutes = router;
