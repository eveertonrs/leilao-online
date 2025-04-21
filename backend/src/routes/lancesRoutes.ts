import { Router } from 'express';
import { getLances, createLance } from '../controllers/lancesController';

const router = Router();

router.get('/', getLances);
router.post('/', createLance);

export default router;
