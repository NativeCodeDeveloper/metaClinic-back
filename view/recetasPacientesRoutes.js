import {Router} from 'express';
import ReecetaPacientesController from '../controller/ReecetaPacientesController.js';

const router = Router();

router.post('/insertarRecetaPaciente', ReecetaPacientesController.insertarRecetaPacienteController);
router.post('/actualizarRecetaPaciente', ReecetaPacientesController.actualizarRecetaPacienteController);
router.post('/seleccionarRecetaPaciente', ReecetaPacientesController.seleccionarRecetaPacienteController);
router.post('/eliminarRecetaPaciente', ReecetaPacientesController.eliminarRecetaPacienteController);
router.post('/seleccionar_todas_Recetas_especificas_pacientes', ReecetaPacientesController.seleccionar_todas_Recetas_especificas_pacientes);
router.get('/seleccionarTodasLasRecetas', ReecetaPacientesController.seleccionarTodasLasRecetas);

export default router;
