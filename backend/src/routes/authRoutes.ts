import express from 'express';
import { login, loginAdmin } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/admin/login', loginAdmin);

export default router;
