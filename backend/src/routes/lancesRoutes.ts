// ============================
// backend/src/routes/lancesRoutes.ts
// ============================
import { Router } from 'express';
import {
  createLance,
  getLancesPorLote,
  getLances,
  getMaiorLance
} from '../controllers/lancesController';

const router = Router();

router.get('/lote/:loteId', getLancesPorLote);
router.get('/lances', getLances);
router.post('/lance', createLance);
router.get('/maior-lance/:loteId', getMaiorLance);

export default router;