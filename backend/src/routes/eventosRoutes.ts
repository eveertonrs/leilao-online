import upload from '../config/upload';
import { Router } from 'express';
import {
  getEventos,
  getEvento,
  createEvento,
  updateEvento,
  deleteEvento,
} from '../controllers/eventosController';

const router = Router();

router.get('/', getEventos);
router.get('/:id', getEvento);

// ⬇️ Adiciona suporte a upload via multer
router.post('/', upload.single('foto_capa'), createEvento);
router.put('/:id', updateEvento);
router.delete('/:id', deleteEvento);

export default router;
