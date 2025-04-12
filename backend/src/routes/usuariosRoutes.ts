// src/routes/usuariosRoutes.ts
import { Router } from 'express';
import {
  getUsuarios,
  getUsuario,
  createUsuario,
  updateUsuario,
  deleteUsuario
} from '../controllers/usuariosController';

const router = Router();

router.get('/', getUsuarios);
router.get('/:id', getUsuario);
router.post('/', createUsuario);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

console.log('🔁 Rotas de usuários carregadas');

export default router;
