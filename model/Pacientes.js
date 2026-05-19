import DataBase from "../config/Database.js";


export default class Pacientes {
    constructor(
        id_paciente,
        estado_paciente,
        nombre,
        apellido,
        rut,
        nacimiento,
        sexo,
        prevision_id,
        telefono,
        correo,
        direccion,
        pais
    ) {
        this.id_paciente = id_paciente;
        this.estado_paciente = estado_paciente;
        this.nombre = nombre;
        this.apellido = apellido;
        this.rut = rut;
        this.nacimiento = nacimiento;
        this.sexo = sexo;
        this.prevision_id = prevision_id;
        this.telefono = telefono;
        this.correo = correo;
        this.direccion = direccion;
        this.pais = pais;
    }

    buildPacienteListadoQuery(whereClause = "pacienteDatos.estado_paciente <> 0") {
        return `
            SELECT
                pacienteDatos.*,
                checkin_alerta.semana_label AS checkin_alerta_semana,
                checkin_alerta.nauseas AS checkin_alerta_nauseas,
                checkin_alerta.vomitos AS checkin_alerta_vomitos,
                checkin_alerta.diarrea AS checkin_alerta_diarrea,
                checkin_alerta.constipacion AS checkin_alerta_constipacion,
                checkin_alerta.dolor_abdominal AS checkin_alerta_dolor_abdominal,
                checkin_alerta.hambre_nocturna AS checkin_alerta_hambre_nocturna,
                CASE
                    WHEN checkin_alerta.id_checkin IS NOT NULL
                     AND (
                        LOWER(COALESCE(checkin_alerta.nauseas, '')) NOT IN ('', 'ninguna', 'ninguno', 'normal', 'no', 'sin sintomas', 'sin síntoma', 'sin sintoma', 'ausente')
                        OR LOWER(COALESCE(checkin_alerta.vomitos, '')) NOT IN ('', 'ninguna', 'ninguno', 'normal', 'no', 'sin sintomas', 'sin síntoma', 'sin sintoma', 'ausente')
                        OR LOWER(COALESCE(checkin_alerta.diarrea, '')) NOT IN ('', 'ninguna', 'ninguno', 'normal', 'no', 'sin sintomas', 'sin síntoma', 'sin sintoma', 'ausente')
                        OR LOWER(COALESCE(checkin_alerta.constipacion, '')) NOT IN ('', 'ninguna', 'ninguno', 'normal', 'no', 'sin sintomas', 'sin síntoma', 'sin sintoma', 'ausente')
                        OR LOWER(COALESCE(checkin_alerta.dolor_abdominal, '')) NOT IN ('', 'ninguna', 'ninguno', 'normal', 'no', 'sin sintomas', 'sin síntoma', 'sin sintoma', 'ausente')
                        OR LOWER(COALESCE(checkin_alerta.hambre_nocturna, '')) NOT IN ('', 'ninguna', 'ninguno', 'normal', 'no', 'sin sintomas', 'sin síntoma', 'sin sintoma', 'ausente')
                    )
                    THEN 1
                    ELSE 0
                END AS checkin_alerta_activa
            FROM pacienteDatos
            LEFT JOIN (
                SELECT portal_paciente_checkin.*
                FROM portal_paciente_checkin
                INNER JOIN (
                    SELECT id_paciente, MAX(id_checkin) AS max_id_checkin
                    FROM portal_paciente_checkin
                    WHERE estado_registro <> 0
                      AND estado_checkin = 'completado'
                    GROUP BY id_paciente
                ) ultimo_checkin
                  ON ultimo_checkin.max_id_checkin = portal_paciente_checkin.id_checkin
            ) checkin_alerta
              ON checkin_alerta.id_paciente = pacienteDatos.id_paciente
            WHERE ${whereClause}
        `;
    }


    // SELECCION DE TODOS LOS PACIENTES DE LA BASE DE DATOS
    async selectPaciente(){
        const conexion = DataBase.getInstance();
        const query = this.buildPacienteListadoQuery();
        try {
            const resultado = await conexion.ejecutarQuery(query);
            return resultado;
        } catch (error) {
            throw new Error('Problema al establecer la conexion con la base de datos desde la clase Pacientes.js')

        }
    }


//SELECCION DE PACIENTE ESPECIFICO POR id?paciente
    async selectPacienteEspecifico(id_paciente){
        const conexion = DataBase.getInstance();
        const query = 'SELECT * FROM pacienteDatos WHERE id_paciente = ? and estado_paciente <> 0';
        const param = [id_paciente]
        try {
            const resultado = await conexion.ejecutarQuery(query, param);
            if (resultado) {
                return resultado;
            }
        } catch (error) {
            throw new Error('No se puede seleccionar paciente especifico / Problema al establecer la conexion con la base de datos desde la clase Pacientes.js')
        }
    }


    //SELECCION DE PACIENTE POR -----> RUT %PARECIDO% <------
    async PacienteParecidoRut(rut){
        const conexion = DataBase.getInstance();
        const query = this.buildPacienteListadoQuery('pacienteDatos.rut LIKE ?');
        const param = [`%${rut}%`]
        try {
            const resultado = await conexion.ejecutarQuery(query, param);
            if (resultado) {
                return resultado;
            }
        } catch (error) {
            throw new Error('No se puede seleccionar paciente / Problema al establecer la conexion con la base de datos desde la clase Pacientes.js')
        }
    }





    //SELECCION DE PACIENTE POR -----> NOMBRE %PARECIDO% <------
    async PacienteParecidoNombre(nombre){
        const conexion = DataBase.getInstance();
        const query = this.buildPacienteListadoQuery('pacienteDatos.nombre LIKE ?');
        const param = [`%${nombre}%`]
        try {
            const resultado = await conexion.ejecutarQuery(query, param);
            if (resultado) {
                return resultado;
            }
        } catch (error) {
            throw new Error('No se puede seleccionar paciente / Problema al establecer la conexion con la base de datos desde la clase Pacientes.js')
        }
    }





// ACTUALIZACION DE PACIENTE POR ID
    async updatePaciente(nombre,apellido,rut,nacimiento,sexo,prevision_id,telefono,correo,direccion,pais,id_paciente){
        const conexion = DataBase.getInstance();
        const query = 'UPDATE pacienteDatos SET nombre= ? ,apellido = ? , rut = ?, nacimiento = ?, sexo = ?, prevision_id = ?, telefono = ?, correo = ? , direccion = ?, pais = ?  WHERE id_paciente = ?';
        const param = [nombre,apellido,rut,nacimiento,sexo,prevision_id,telefono,correo,direccion,pais,id_paciente ];
        try {
            const resultado = await conexion.ejecutarQuery(query,param);
            if (resultado) {
                return resultado;
            }
        } catch (error) {
            throw new Error('NO se logo actualizar paciente  / Problema al establecer la conexion con la base de datos desde la clase Pacientes.js')
        }
    }



// INSERCION DE NUEVO PACIENTE EN LA BASE DE DATOS
    async insertPaciente(nombre,apellido,rut,nacimiento,sexo,prevision_id,telefono,correo,direccion,pais){
        const conexion = DataBase.getInstance();
        const query = 'INSERT INTO pacienteDatos (nombre,apellido,rut,nacimiento,sexo,prevision_id,telefono,correo,direccion,pais) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const param = [
            nombre,
            apellido,
            rut,
            nacimiento,
            sexo,
            prevision_id,
            telefono,
            correo,
            direccion,
            pais];

        try {
            const resultado = await conexion.ejecutarQuery(query,param);
            if (resultado){
                return resultado;
            }
        } catch (error) {
            throw new Error('NO se logo ingresar paciente nuevo / Problema al establecer la conexion con la base de datos desde la clase Pacientes.js')
        }
    }



    // ELIMINACION LOGICA DE PACIENTE DE LA BASE DE DATOS
    async deletePaciente(id_paciente){
        const conexion = DataBase.getInstance();
        const query = 'UPDATE pacienteDatos SET estado_paciente = 0 WHERE id_paciente = ?';
        const param = [id_paciente];
        try {
            const resultado = await conexion.ejecutarQuery(query,param);

            if (resultado) {
                return resultado;
            } else {
                return resultado;

            }
        } catch (error) {
            throw new Error('NO se logo Eliminar paciente  / Problema al establecer la conexion con la base de datos desde la clase Pacientes.js')

        }
    }







// INSERCION DE NUEVO PACIENTE EN LA BASE DE DATOS
    async insertPacientemp(nombre,apellido,rut,nacimiento,sexo,prevision_id,telefono,correo,direccion,pais){
        const conexion = DataBase.getInstance();

        try {
            const queryVerificadora = 'SELECT * FROM pacienteDatos WHERE rut = ?';
            const paramVerificadora = [rut];

            const respuestaConsultaVerificacion = await conexion.ejecutarQuery(queryVerificadora, paramVerificadora);

            if (respuestaConsultaVerificacion.length > 0) {
                // Ya existe un paciente con ese preference_id
                return { duplicado: true };
            }else{

                const query = 'INSERT INTO pacienteDatos (nombre,apellido,rut,nacimiento,sexo,prevision_id,telefono,correo,direccion,pais) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                const param = [nombre, apellido, rut, nacimiento, sexo, prevision_id, telefono, correo, direccion, pais];
                const resultado = await conexion.ejecutarQuery(query,param);
                if (resultado){
                    return resultado;
                }
            }

        } catch (error) {
            throw new Error('NO se logo ingresar paciente nuevo / Problema al establecer la conexion con la base de datos desde la clase Pacientes.js')
        }
    }




}
