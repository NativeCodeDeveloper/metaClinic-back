import { Router } from "express";
import PortalPacientesController from "../controller/PortalPacientesController.js";

const router = Router();

router.get("/resumenAlertasCheckin", PortalPacientesController.resumenAlertasCheckin);
router.post("/marcarAlertaCheckinRevisada", PortalPacientesController.marcarAlertaCheckinRevisada);
router.post("/resumenPacientePortal", PortalPacientesController.resumenPacientePortal);
router.post("/guardarCheckinSemanal", PortalPacientesController.guardarCheckinSemanal);
router.post("/insertarMensajePaciente", PortalPacientesController.insertarMensajePaciente);
router.post("/enviarRecordatoriosCheckinPendiente", PortalPacientesController.enviarRecordatoriosCheckinPendiente);

export default router;
