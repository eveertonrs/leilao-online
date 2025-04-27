import upload from '../config/upload';
import { Router } from 'express';

import {
  getEventos,
  getEvento,
  createEvento,
  updateEvento,
  deleteEvento,
} from '../controllers/eventosController';

import { autenticarToken } from '../middleware/authMiddleware'; // ✅ Autenticação básica
import { autenticarAdmin } from '../middleware/autenticarAdmin'; // ✅ Autorização específica para ADMIN

const router = Router();

// ⬅️ Rotas públicas (acessível por qualquer usuário logado ou não)
router.get('/', getEventos);
router.get('/:id', getEvento);

// ⬇️ Rotas protegidas (somente ADMIN pode criar, editar, excluir)
router.post('/', autenticarToken, autenticarAdmin, upload.single('foto_capa'), createEvento);
router.put('/:id', autenticarToken, autenticarAdmin, upload.single('foto_capa'), updateEvento);
router.delete('/:id', autenticarToken, autenticarAdmin, deleteEvento);

export default router;
