import DataBase from "../config/Database.js";


export default class EvaluacionClinica {
    constructor(
        id_evaluacion,
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
    estado_evaluacion_clinica
    ) {
        this.id_evaluacion = id_evaluacion;
                this.id_paciente = id_paciente;
                this.id_ficha_clinica= id_ficha_clinica;
                this.tipo_evaluacion = tipo_evaluacion;
                this.version_protocolo = version_protocolo;
                this.estado = estado;
                this.fecha_evaluacion = fecha_evaluacion;
                this.profesional_id  = profesional_id;
                this.peso_kg = peso_kg;
                this.talla_cm  = talla_cm;
                this.cintura_cm  = cintura_cm;
                this.imc = imc;
                this.pa_sistolica = pa_sistolica;
                this.pa_diastolica = pa_diastolica;
                this.actividad_fisica = actividad_fisica;
                this.motivo_consulta = motivo_consulta;
                this.medicamentos_actuales = medicamentos_actuales;
                this.alergias  = alergias;
                this.tratamientos_previos_obesidad  = tratamientos_previos_obesidad;
                this.historia_familiar  = historia_familiar;
                this.observaciones_clinicas  = observaciones_clinicas;
                this.resultado_elegibilidad = resultado_elegibilidad;
                this.justificacion_resultado  = justificacion_resultado;
                this.score_total = score_total;
                this.fecha_creacion = fecha_creacion;
                this.estado_evaluacion_clinica = estado_evaluacion_clinica;
    }

    //CREAR EVOLUCION
    async insertarEvolucionModel(
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
    ){
        try{
            const conexion = DataBase.getInstance();
            const query = `
            INSERT INTO evaluacion_clinica
            (
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
    fecha_creacion) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            `;

            const parms =[
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
            ]
            const resultadoConsultaBaseDatos = await conexion.ejecutarQuery(query, parms);
           if(resultadoConsultaBaseDatos){
               return resultadoConsultaBaseDatos;
           }else{
                return resultadoConsultaBaseDatos;
            }
        }catch(error){
            throw error;
        }
    }


    //SELECCIONAR EVOLUCION ESPECIFICA POR SU ID
    async seleccionar_evolucionEspecifica(id_evaluacion){
        try {
            const conexion = DataBase.getInstance();
            const query = `
            SELECT * FROM evaluacion_clinica WHERE id_evaluacion = ? AND estado_evaluacion_clinica <> 0 
            `;
            const params = [id_evaluacion];

            const respuestConsulta = await conexion.ejecutarQuery(query, params);
            if(respuestConsulta){
                return respuestConsulta;
            }else{
                return respuestConsulta;
            }
        }catch(error){
            throw error;
        }
    }


    //SELECCIONAR TODAS LAS EVOLUCIONES POR EL ID DEL PACIENTE AL QUE PERTENECEN
    async seleccionar_todas_evoluciones(){
        try{
            const conexion = DataBase.getInstance();
            const query = `
            SELECT * FROM evaluacion_clinica WHERE estado_evaluacion_clinica <> 0 
            `;
            const respuestConsulta = await conexion.ejecutarQuery(query);
            if(respuestConsulta){
                return respuestConsulta;
            }else{
                return respuestConsulta;
            }
        }catch(error){
            throw error;
        }
    }


    //ELIMINAR EVOLUCION
    async eliminar_evolucionEspecifica(id_evaluacion){
        try {
            const conexion = DataBase.getInstance();
            const query = `
            UPDATE evaluacion_clinica SET estado_evaluacion_clinica = 0 WHERE id_evaluacion = ?`;
            const params = [id_evaluacion];
            const respuestaConsulta = await conexion.ejecutarQuery(query, params);
            if(respuestaConsulta){
                return respuestaConsulta;
            }else{
                return respuestaConsulta;
            }
        }catch(error){
            throw error;
        }
    }


    //ACTUALIZAR EVOLUCION
    async actualizar_evolucionEspecifica(
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
    ){
        try {
            const conexion = DataBase.getInstance();
            const query = `
            UPDATE evaluacion_clinica 
            SET 
        id_paciente =?,
        id_ficha_clinica = ?,
        tipo_evaluacion = ?,
        version_protocolo = ?,
        estado = ?,
        fecha_evaluacion = ?,
        profesional_id = ?,
        peso_kg = ?,
        talla_cm = ?,
        cintura_cm = ?,
        imc = ?,
        pa_sistolica = ?,
        pa_diastolica = ?,
        actividad_fisica = ?,
        motivo_consulta = ?,
        medicamentos_actuales = ?,
        alergias = ?,
        tratamientos_previos_obesidad = ?,
        historia_familiar = ?,
        observaciones_clinicas = ?,
        resultado_elegibilidad = ?, 
        justificacion_resultado = ?,
        score_total = ?,
        fecha_creacion = ? 
        
        WHERE id_evaluacion = ?`;

            const params = [
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
            ];

            const respuestaConsulta = await conexion.ejecutarQuery(query, params);
            if(respuestaConsulta){
                return respuestaConsulta;
            }else{
                return respuestaConsulta;
            }
        }catch(error){
            throw error;
        }
    }




    //SELECCIONAR TODAS LAS EVOLUCIONES
    async seleccionar_todas_evaluaciones_paciente_especifico(id_paciente){
        try {
            const conexion = DataBase.getInstance();
            const query = `
            SELECT 
            evaluacion_clinica.*,
            pacienteDatos.nombre,
            pacienteDatos.apellido,
            pacienteDatos.rut
            
            FROM evaluacion_clinica
            
            INNER JOIN pacienteDatos ON
            pacienteDatos.id_paciente = evaluacion_clinica.id_paciente
            
            WHERE id_paciente=? AND estado_evaluacion_clinica <> 0`;

            const params = [
                id_paciente
            ]

            const resultadoConsulta = conexion.ejecutarQuery(query, params);
            if(resultadoConsulta){
                return resultadoConsulta;
            }else{
                return resultadoConsulta;
            }
        }catch(error){
            throw error;
        }
    }





    //OBTENER LA ULTIMA EVOLUCION INGRESADA
    async seleccionar_ultimaEvaluacion_paciente(id_paciente){
        try {
            const conexion = DataBase.getInstance();
            const query = `
            SELECT 
            evaluacion_clinica.*,
            pacienteDatos.nombre,
            pacienteDatos.apellido,
            pacienteDatos.rut
            
            FROM evaluacion_clinica
            
            INNER JOIN pacienteDatos ON
            pacienteDatos.id_paciente = evaluacion_clinica.id_paciente
            
            WHERE id_paciente=? AND estado_evaluacion_clinica <> 0
            
            ORDER BY evaluacion_clinica.fecha_evaluacion DESC
            `;

            const params = [
                id_paciente
            ];

            const resultadoConsulta = conexion.ejecutarQuery(query, params);
            if(Array.isArray(resultadoConsulta) && resultadoConsulta.length > 0){
                return resultadoConsulta[0];
            }else{
                return [];
            }
        }catch(error){
            throw error;
        }
    }
}