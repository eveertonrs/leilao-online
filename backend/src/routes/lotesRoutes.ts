import { Router } from 'express';
import {
  getLotes,
  getLote,
  createLote,
  updateLote,
  deleteLote
} from '../controllers/lotesController';

const router = Router();

// GET: listar todos os lotes
router.get('/', getLotes);

// GET: buscar um lote específico por ID
router.get('/:id', getLote);

// POST: criar um novo lote
router.post('/', createLote);

// PUT: atualizar um lote existente
router.put('/:id', updateLote);

// DELETE: remover um lote
router.delete('/:id', deleteLote);

export default router;
