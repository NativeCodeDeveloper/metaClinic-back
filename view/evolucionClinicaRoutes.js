import express from 'express';
import EvaluacionClinicaController from "../controller/EvolucionClinicaController.js";
const router = express.Router();

router.post("/insertarEvaluacion", EvaluacionClinicaController.crear_evolucion_controller )
router.post("/seleccionar_evolucionEspecifica", EvaluacionClinicaController.seleccionar_evolucionEspecifica_controller )
router.get("/seleccionar_todas_evoluciones", EvaluacionClinicaController.seleccionar_todas_evoluciones )
router.post("/eliminar_evolucionEspecifica_controller", EvaluacionClinicaController.eliminar_evolucionEspecifica_controller )
router.post("/actualizar_evolucionEspecifica_controller", EvaluacionClinicaController.actualizar_evolucionEspecifica_controller )
router.post("/seleccionar_ultimaEvaluacion_paciente", EvaluacionClinicaController.seleccionar_ultimaEvaluacion_paciente_controller )






export default router;