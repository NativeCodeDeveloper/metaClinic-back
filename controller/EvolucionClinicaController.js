import EvolucionClinica from '../model/EvaluacionClinica.js';

export default class EvolucionClinicaController {
    constructor () {
    }

    //CREAR EVOLUCION
    static async crear_evolucion_controller(req, res) {
        try{
            const {
                id_paciente,
                id_ficha_clinica,
                tipo_evaluacion,
                version_protocolo,
                estado,
                fecha_evaluacion,
                profesional_id,
                peso_kg,
                talla_cm,
                cintura_cm,
                imc,
                pa_sistolica,
                pa_diastolica,
                actividad_fisica,
                motivo_consulta,
                medicamentos_actuales,
                alergias,
                tratamientos_previos_obesidad,
                historia_familiar,
                observaciones_clinicas,
                resultado_elegibilidad,
                justificacion_resultado,
                score_total,
                fecha_creacion
            } = req.body;

            console.log(req.body);

            if(!id_paciente){
                return res.status(400).send({
                    message: 'sindata',
                })
            }

            const EvolucionClincaClass = new EvolucionClinica();
            const resultadoModel = await EvolucionClincaClass.insertarEvolucionModel(
                id_paciente,
                id_ficha_clinica,
                tipo_evaluacion,
                version_protocolo,
                estado,
                fecha_evaluacion,
                profesional_id,
                peso_kg,
                talla_cm,
                cintura_cm,
                imc,
                pa_sistolica,
                pa_diastolica,
                actividad_fisica,
                motivo_consulta,
                medicamentos_actuales,
                alergias,
                tratamientos_previos_obesidad,
                historia_familiar,
                observaciones_clinicas,
                resultado_elegibilidad,
                justificacion_resultado,
                score_total,
                fecha_creacion
            );
            if(resultadoModel.affectedRows > 0){
                return res.status(200).send({
                    message: true
                })
            }else{
                return res.status(200).send({message: false})
            }
        }catch(error){
            return res.status(500).send({message: `serverError + error: ${error}`});
        }
    }


    //SELECCIONAR EVOLUCION ESPECIFICA POR SU ID
    static async seleccionar_evolucionEspecifica_controller(req, res) {
        try{
            const {
                id_evaluacion
            } = req.body;
            console.log(req.body);

            if(!id_evaluacion){
                return res.status(400).send({
                    message: 'sindata',
                })
            }
            const EvolucionClincaClass = new EvolucionClinica();
            const resultadoModel = await EvolucionClincaClass.seleccionar_evolucionEspecifica(id_evaluacion);
            if(Array.isArray(resultadoModel) && resultadoModel.length > 0){
                return res.status(200).send({
                    resultadoModel
                })
            }else{
                return res.status(200).send([])
            }
        }catch(error){
            return res.status(500).send({message: `serverError + error: ${error}`});
        }
    }



    //SELECCIONAR TODAS LAS EVOLUCIONES POR EL ID DEL PACIENTE AL QUE PERTENECEN
    static async seleccionar_todas_evoluciones(req, res) {
        try{
            const EvolucionClincaClass = new EvolucionClinica();
            const resultadoModel = await EvolucionClincaClass.seleccionar_todas_evoluciones();

            if(Array.isArray(resultadoModel) && resultadoModel.length > 0){
                return res.status(200).send({
                    resultadoModel
                })
            }else{
                return res.status(200).send([])
            }

        }catch(error){
            return res.status(500).send({message: `serverError + error: ${error}`});
        }
    }


    //ELIMINAR EVOLUCION eliminar_evolucionEspecifica
    static async eliminar_evolucionEspecifica_controller(req, res) {
        try{
            const {
                id_evaluacion
            } = req.body;

            console.log(req.body);
            if(!id_evaluacion){
                return res.status(400).send({
                    message: 'sindata',
                })
            }
            const EvolucionClincaClass = new EvolucionClinica();
            const resultadoModel = await EvolucionClincaClass.eliminar_evolucionEspecifica(id_evaluacion);

            if(resultadoModel.affectedRows > 0){
                return res.status(200).send({
                    message: true
                })
            }else{
                return res.status(200).send({message: false})
            }

        }catch(error){
            return res.status(500).send({message: `serverError + error: ${error}`});
        }
    }



    //ACTUALIZAR EVOLUCION
    static async actualizar_evolucionEspecifica_controller(req, res) {
        try{
            const {
                id_paciente,
                id_ficha_clinica,
                tipo_evaluacion,
                version_protocolo,
                estado,
                fecha_evaluacion,
                profesional_id,
                peso_kg,
                talla_cm,
                cintura_cm,
                imc,
                pa_sistolica,
                pa_diastolica,
                actividad_fisica,
                motivo_consulta,
                medicamentos_actuales,
                alergias,
                tratamientos_previos_obesidad,
                historia_familiar,
                observaciones_clinicas,
                resultado_elegibilidad,
                justificacion_resultado,
                score_total,
                fecha_creacion,
                id_evaluacion
            } = req.body;

            console.log(req.body);

            if(!id_evaluacion){
                return res.status(400).send({
                    message: 'sindata',
                })
            }
            const EvolucionClincaClass = new EvolucionClinica();
            const resultadoModel = await EvolucionClincaClass.actualizar_evolucionEspecifica(
                id_paciente,
                id_ficha_clinica,
                tipo_evaluacion,
                version_protocolo,
                estado,
                fecha_evaluacion,
                profesional_id,
                peso_kg,
                talla_cm,
                cintura_cm,
                imc,
                pa_sistolica,
                pa_diastolica,
                actividad_fisica,
                motivo_consulta,
                medicamentos_actuales,
                alergias,
                tratamientos_previos_obesidad,
                historia_familiar,
                observaciones_clinicas,
                resultado_elegibilidad,
                justificacion_resultado,
                score_total,
                fecha_creacion,
                id_evaluacion
            );

            if(resultadoModel.affectedRows > 0){
                return res.status(200).send({
                    message: true
                })
            }else{
                return res.status(200).send({message: false})
            }

        }catch(error){
            return res.status(500).send({message: `serverError + error: ${error}`});
        }
    }






    //ELIMINAR EVOLUCION eliminar_evolucionEspecifica
    static async seleccionar_ultimaEvaluacion_paciente_controller(req, res) {
        try{
            const {
                id_paciente
            } = req.body;

            console.log(req.body);

            if(!id_paciente){
                return res.status(400).send({
                    message: 'sindata',
                })
            }
            const EvolucionClincaClass = new EvolucionClinica();
            const resultadoModel = await EvolucionClincaClass.seleccionar_ultimaEvaluacion_paciente(id_paciente);

            if(Array.isArray(resultadoModel.affectedRows) && resultadoModel.length > 0){
                return res.status(200).send(resultadoModel)
            }else{
                return res.status(200).send([])
            }
        }catch(error){
            return res.status(500).send({message: `serverError + error: ${error}`});
        }
    }




    //ELIMINAR EVOLUCION eliminar_evolucionEspecifica
    static async seleccionar_todas_evaluaciones_paciente_especifico(req, res) {
        try{
            const {
                id_paciente
            } = req.body;

            console.log(req.body);

            if(!id_paciente){
                return res.status(400).send({
                    message: 'sindata',
                })
            }
            const EvolucionClincaClass = new EvolucionClinica();
            const resultadoModel = await EvolucionClincaClass.seleccionar_todas_evaluaciones_paciente_especifico(id_paciente);

            if(Array.isArray(resultadoModel.affectedRows) && resultadoModel.length > 0){
                return res.status(200).send(resultadoModel)
            }else{
                return res.status(200).send([])
            }
        }catch(error){
            return res.status(500).send({message: `serverError + error: ${error}`});
        }
    }




}