import upload from '../config/upload';
import { Router } from 'express';
import {
  getEventos,
  getEvento,
  createEvento,
  updateEvento,
  deleteEvento,
} from '../controllers/eventosController';

import { autenticarToken } from '../middleware/authMiddleware'; // ✅ Importa o middleware

const router = Router();

// Rotas públicas
router.get('/', getEventos);
router.get('/:id', getEvento);

// ⬇️ Rotas protegidas com autenticação
router.post('/', autenticarToken, upload.single('foto_capa'), createEvento);
router.put('/:id', autenticarToken, upload.single('foto_capa'), updateEvento);
router.delete('/:id', autenticarToken, deleteEvento);

export default router;
