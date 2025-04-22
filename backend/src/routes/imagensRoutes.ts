// backend/src/routes/imagensRoutes.ts
import { Router, Request, Response } from 'express';
import multer from 'multer';
import multerConfig from '../config/multerConfig';

const router = Router();
const upload = multer(multerConfig);

router.post('/', upload.single('imagem'), (req: Request, res: Response): void => {
  res.json({ path: req.file?.filename });
});

export default router;
