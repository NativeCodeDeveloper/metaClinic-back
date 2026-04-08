import { Router } from "express";
import EvolucionCriterioController from '../controller/EvolucionCriterioController.js'
const router = Router();

router.post('/guardarCriteriosEvaluacion', EvolucionCriterioController.guardarCriteriosEvaluacion)
router.post('/obtenerCriteriosPorEvaluacion', EvolucionCriterioController.obtenerCriteriosPorEvaluacion)
router.post('/actualizarSwitchEspecifico', EvolucionCriterioController.actualizarSwitchEspecifico)
router.post('/eliminarEvaluacionCriterio', EvolucionCriterioController.eliminarEvaluacionCriterio)
router.post('/obtener_criterios_evaluacion_especifica', EvolucionCriterioController.obtener_criterios_evaluacion_especifica)



export default router;