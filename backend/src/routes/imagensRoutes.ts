import { Router } from 'express';
import { getImagensPorLote, createImagem } from '../controllers/imagensController';

const router = Router();

router.get('/:lote_id', getImagensPorLote);  // imagens de um lote específico
router.post('/', createImagem);             // adicionar nova imagem

export default router;
