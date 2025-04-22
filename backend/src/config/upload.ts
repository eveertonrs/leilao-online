import multer from 'multer';
import path from 'path';

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const uniqueName = `${name}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export default upload;
