import express from 'express';
import coordinadorController from '../controllers/coordinadorController.js';

const router = express.Router();

router.post('/', coordinadorController.registrarCoordinador);
router.get('/:cedula', coordinadorController.obtenerCoordinador);
router.get('/', coordinadorController.listarCoordinadores);

export default router;