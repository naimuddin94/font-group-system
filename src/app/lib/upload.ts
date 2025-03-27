import status from 'http-status';
import multer from 'multer';
import path from 'path';
import { AppError } from '../utils';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/fonts/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /ttf/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (extname) {
      return cb(null, true);
    }
    cb(new AppError(status.BAD_REQUEST, 'Only TTF files are allowed'));
  },
});

export default upload;
