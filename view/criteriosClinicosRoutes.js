import express from 'express';
const router = express.Router();
import CriteriosController from '../controller/CriteriosClinicosController.js';

router.post('/crear', CriteriosController.crearCriterio)
router.get('/obtenerTodosActivos', CriteriosController.obtenerTodosActivos)
router.post('/obtenerPorId', CriteriosController.obtenerPorId)
router.post('/actualizarCriterio', CriteriosController.actualizarCriterio)
router.post('/eliminarCriterio', CriteriosController.eliminarCriterio)
router.get('/obtenerExcluyentesGLP1', CriteriosController.obtenerExcluyentesGLP1)
router.post('/obtenercriterios_valor_tipo', CriteriosController.obtenercriterios_valor_tipo)




export default router;