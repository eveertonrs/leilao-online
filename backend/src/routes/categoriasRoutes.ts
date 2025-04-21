import { Router } from 'express';
import {
  getCategorias,
  getCategoria,
  createCategoria,
  updateCategoria,
  deleteCategoria
} from '../controllers/categoriasController';

const router = Router();

router.get('/', getCategorias);        // Buscar todas as categorias
router.get('/:id', getCategoria);      // Buscar uma categoria por ID
router.post('/', createCategoria);     // Criar nova categoria
router.put('/:id', updateCategoria);   // Atualizar categoria
router.delete('/:id', deleteCategoria); // Deletar categoria

export default router;
