// backend/src/config/multerConfig.ts
import path from 'path';
import { Options } from 'multer';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const multerConfig: Options = {
  storage,
};

export default multerConfig;
