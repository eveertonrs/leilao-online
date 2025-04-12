// src/routes/eventosRoutes.ts
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
router.post('/', createEvento);
router.put('/:id', updateEvento);
router.delete('/:id', deleteEvento);


export default router;
