import DataBase from "../config/Database.js";

export default class PortalPacientes {
    constructor(
        id_checkin,
        id_paciente,
        semana_clave,
        semana_label,
        estado_checkin,
        peso,
        cintura,
        presion_arterial,
        glicemia_ayuno,
        horas_ejercicio,
        adherencia_tratamiento,
        apetito_semana
    ) {
        this.id_checkin = id_checkin;
        this.id_paciente = id_paciente;
        this.semana_clave = semana_clave;
        this.semana_label = semana_label;
        this.estado_checkin = estado_checkin;
        this.peso = peso;
        this.cintura = cintura;
        this.presion_arterial = presion_arterial;
        this.glicemia_ayuno = glicemia_ayuno;
        this.horas_ejercicio = horas_ejercicio;
        this.adherencia_tratamiento = adherencia_tratamiento;
        this.apetito_semana = apetito_semana;
    }

    async seleccionarPacientePortalPorCorreo(correo) {
        const conexion = DataBase.getInstance();
        const query = `
            SELECT *
            FROM pacienteDatos
            WHERE LOWER(correo) = LOWER(?)
              AND estado_paciente <> 0
            LIMIT 1
        `;
        const params = [correo];

        try {
            const resultado = await conexion.ejecutarQuery(query, params);
            return resultado;
        } catch (error) {
            throw new Error("Problema al consultar paciente por correo desde PortalPacientes.js");
        }
    }

    async seleccionarControlesProximosPaciente(correo) {
        const conexion = DataBase.getInstance();
        const query = `
            SELECT
                reservaPacientes.id_reserva,
                reservaPacientes.fechaInicio,
                reservaPacientes.horaInicio,
                reservaPacientes.fechaFinalizacion,
                reservaPacientes.horaFinalizacion,
                reservaPacientes.estadoReserva,
                reservaPacientes.id_profesional,
                profesionales.nombreProfesional
            FROM reservaPacientes
            LEFT JOIN profesionales
              ON profesionales.id_profesional = reservaPacientes.id_profesional
            WHERE LOWER(reservaPacientes.email) = LOWER(?)
              AND reservaPacientes.estadoPeticion <> 0
              AND reservaPacientes.estadoReserva NOT IN ('cancelada', 'anulada')
              AND TIMESTAMP(reservaPacientes.fechaInicio, reservaPacientes.horaInicio) >= NOW()
            ORDER BY reservaPacientes.fechaInicio ASC, reservaPacientes.horaInicio ASC
            LIMIT 5
        `;
        const params = [correo];

        try {
            const resultado = await conexion.ejecutarQuery(query, params);
            return resultado;
        } catch (error) {
            throw new Error("Problema al consultar controles proximos desde PortalPacientes.js");
        }
    }

    async seleccionarProgresoPesoPaciente(id_paciente) {
        const conexion = DataBase.getInstance();
        const query = `
            SELECT
                id_evaluacion,
                fecha_evaluacion,
                peso_kg,
                cintura_cm,
                imc
            FROM evaluacion_clinica
            WHERE id_paciente = ?
              AND estado_evaluacion_clinica <> 0
              AND peso_kg IS NOT NULL
            ORDER BY fecha_evaluacion ASC, id_evaluacion ASC
        `;
        const params = [id_paciente];

        try {
            const resultado = await conexion.ejecutarQuery(query, params);
            return resultado;
        } catch (error) {
            throw new Error("Problema al consultar progreso de peso desde PortalPacientes.js");
        }
    }

    async seleccionarMensajesPaciente(id_paciente) {
        const conexion = DataBase.getInstance();
        const query = `
            SELECT
                id_mensaje,
                tipo_mensaje,
                titulo,
                mensaje,
                fecha_publicacion
            FROM portal_paciente_mensajes
            WHERE id_paciente = ?
              AND estado_visible <> 0
            ORDER BY fecha_publicacion DESC, id_mensaje DESC
        `;
        const params = [id_paciente];

        try {
            const resultado = await conexion.ejecutarQuery(query, params);
            return resultado;
        } catch (error) {
            throw new Error("Problema al consultar mensajes del portal desde PortalPacientes.js");
        }
    }

    async seleccionarCheckinSemanalPaciente(id_paciente, semana_clave) {
        const conexion = DataBase.getInstance();
        const query = `
            SELECT *
            FROM portal_paciente_checkin
            WHERE id_paciente = ?
              AND semana_clave = ?
              AND estado_registro <> 0
            ORDER BY id_checkin DESC
            LIMIT 1
        `;
        const params = [id_paciente, semana_clave];

        try {
            const resultado = await conexion.ejecutarQuery(query, params);
            return resultado;
        } catch (error) {
            throw new Error("Problema al consultar checkin semanal desde PortalPacientes.js");
        }
    }

    async insertarCheckinSemanalPendiente(id_paciente, semana_clave, semana_label, fecha_inicio_semana, fecha_fin_semana) {
        const conexion = DataBase.getInstance();
        const query = `
            INSERT INTO portal_paciente_checkin
            (
                id_paciente,
                semana_clave,
                semana_label,
                fecha_inicio_semana,
                fecha_fin_semana,
                estado_checkin,
                fecha_creacion
            )
            VALUES (?, ?, ?, ?, ?, 'pendiente', NOW())
        `;
        const params = [
            id_paciente,
            semana_clave,
            semana_label,
            fecha_inicio_semana,
            fecha_fin_semana
        ];

        try {
            const resultado = await conexion.ejecutarQuery(query, params);
            return resultado;
        } catch (error) {
            throw new Error("Problema al insertar checkin pendiente desde PortalPacientes.js");
        }
    }

    async actualizarCheckinSemanalPaciente(
        id_checkin,
        peso,
        cintura,
        presion_arterial,
        glicemia_ayuno,
        horas_ejercicio,
        adherencia_tratamiento,
        apetito_semana,
        nauseas,
        vomitos,
        diarrea,
        constipacion,
        dolor_abdominal,
        hambre_nocturna,
        observaciones_paciente
    ) {
        const conexion = DataBase.getInstance();
        const query = `
            UPDATE portal_paciente_checkin
            SET
                peso = ?,
                cintura = ?,
                presion_arterial = ?,
                glicemia_ayuno = ?,
                horas_ejercicio = ?,
                adherencia_tratamiento = ?,
                apetito_semana = ?,
                nauseas = ?,
                vomitos = ?,
                diarrea = ?,
                constipacion = ?,
                dolor_abdominal = ?,
                hambre_nocturna = ?,
                observaciones_paciente = ?,
                estado_checkin = 'completado',
                fecha_registro = NOW(),
                fecha_actualizacion = NOW()
            WHERE id_checkin = ?
        `;
        const params = [
            peso,
            cintura,
            presion_arterial,
            glicemia_ayuno,
            horas_ejercicio,
            adherencia_tratamiento,
            apetito_semana,
            nauseas,
            vomitos,
            diarrea,
            constipacion,
            dolor_abdominal,
            hambre_nocturna,
            observaciones_paciente,
            id_checkin
        ];

        try {
            const resultado = await conexion.ejecutarQuery(query, params);
            return resultado;
        } catch (error) {
            throw new Error("Problema al actualizar checkin semanal desde PortalPacientes.js");
        }
    }

    async insertarMensajePaciente(id_paciente, tipo_mensaje, titulo, mensaje) {
        const conexion = DataBase.getInstance();
        const query = `
            INSERT INTO portal_paciente_mensajes
            (
                id_paciente,
                tipo_mensaje,
                titulo,
                mensaje,
                fecha_publicacion,
                estado_visible
            )
            VALUES (?, ?, ?, ?, NOW(), 1)
        `;
        const params = [id_paciente, tipo_mensaje, titulo, mensaje];

        try {
            const resultado = await conexion.ejecutarQuery(query, params);
            return resultado;
        } catch (error) {
            throw new Error("Problema al insertar mensaje del portal desde PortalPacientes.js");
        }
    }

    async seleccionarCheckinsPendientesRecordatorio() {
        const conexion = DataBase.getInstance();
        const query = `
            SELECT
                portal_paciente_checkin.id_checkin,
                portal_paciente_checkin.id_paciente,
                portal_paciente_checkin.semana_label,
                portal_paciente_checkin.fecha_ultimo_recordatorio,
                portal_paciente_checkin.cantidad_recordatorios,
                pacienteDatos.nombre,
                pacienteDatos.apellido,
                pacienteDatos.correo
            FROM portal_paciente_checkin
            INNER JOIN pacienteDatos
              ON pacienteDatos.id_paciente = portal_paciente_checkin.id_paciente
            WHERE portal_paciente_checkin.estado_registro <> 0
              AND portal_paciente_checkin.estado_checkin = 'pendiente'
              AND pacienteDatos.estado_paciente <> 0
              AND (
                  portal_paciente_checkin.fecha_ultimo_recordatorio IS NULL
                  OR portal_paciente_checkin.fecha_ultimo_recordatorio <= DATE_SUB(NOW(), INTERVAL 1 DAY)
              )
        `;

        try {
            const resultado = await conexion.ejecutarQuery(query);
            return resultado;
        } catch (error) {
            throw new Error("Problema al consultar checkins pendientes desde PortalPacientes.js");
        }
    }

    async marcarRecordatorioCheckin(id_checkin) {
        const conexion = DataBase.getInstance();
        const query = `
            UPDATE portal_paciente_checkin
            SET
                fecha_ultimo_recordatorio = NOW(),
                cantidad_recordatorios = COALESCE(cantidad_recordatorios, 0) + 1
            WHERE id_checkin = ?
        `;
        const params = [id_checkin];

        try {
            const resultado = await conexion.ejecutarQuery(query, params);
            return resultado;
        } catch (error) {
            throw new Error("Problema al marcar recordatorio desde PortalPacientes.js");
        }
    }
}
