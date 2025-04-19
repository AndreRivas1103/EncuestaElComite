import express from 'express';
import { verificarCorreo } from '../controllers/coordinadorController.js';

const router = express.Router();
router.post('/login', verificarCorreo);

export default router;