import express from 'express';
import opcionController from '../controllers/opcionController.js';

const router = express.Router();

router.post('/', opcionController.crearOpcion);
router.get('/pregunta/:id_pregunta', opcionController.obtenerOpciones);
router.delete('/:id_opcion', opcionController.eliminarOpcion);

export default router;