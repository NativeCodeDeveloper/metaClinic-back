import "dotenv/config";
import PortalPacientes from "../model/PortalPacientes.js";

function startOfWeek(date) {
    const base = new Date(date);
    const day = base.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    base.setHours(0, 0, 0, 0);
    base.setDate(base.getDate() + diff);
    return base;
}

function endOfWeek(date) {
    const base = startOfWeek(date);
    base.setDate(base.getDate() + 6);
    base.setHours(23, 59, 59, 999);
    return base;
}

function toDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getCurrentWeekData() {
    const today = new Date();
    const inicio = startOfWeek(today);
    const fin = endOfWeek(today);
    const semana_clave = toDateString(inicio);
    const semana_label = `Semana del ${toDateString(inicio)} al ${toDateString(fin)}`;

    return {
        semana_clave,
        semana_label,
        fecha_inicio_semana: toDateString(inicio),
        fecha_fin_semana: toDateString(fin),
    };
}

function hasValue(value) {
    return value !== undefined && value !== null && String(value).trim() !== "";
}

function normalizeString(value) {
    return hasValue(value) ? String(value).trim() : "";
}

function isSymptomAlert(value) {
    const normalized = normalizeString(value).toLowerCase();

    if (!normalized) {
        return false;
    }

    return ![
        "ninguna",
        "ninguno",
        "no",
        "sin sintomas",
        "sin síntoma",
        "sin sintoma",
        "normal",
        "ausente",
    ].includes(normalized);
}

function buildAutomaticFeedback(checkin) {
    const hallazgos = [];

    if (["Regular", "Mala"].includes(checkin.adherencia_tratamiento)) {
        hallazgos.push("detectamos baja adherencia al tratamiento esta semana");
    }

    if (["Muy reducido", "Aumentado"].includes(checkin.apetito_semana)) {
        hallazgos.push("tu apetito cambio respecto de lo esperado");
    }

    const sintomasConAlerta = [
        ["náuseas", checkin.nauseas],
        ["vómitos", checkin.vomitos],
        ["diarrea", checkin.diarrea],
        ["constipación", checkin.constipacion],
        ["dolor abdominal", checkin.dolor_abdominal],
        ["hambre nocturna", checkin.hambre_nocturna],
    ].filter(([, value]) => isSymptomAlert(value));

    if (sintomasConAlerta.length > 0) {
        hallazgos.push(
            `registraste síntomas para ${sintomasConAlerta.map(([label]) => label).join(", ")}`
        );
    }

    if (hallazgos.length === 0) {
        return {
            titulo: "Check-in semanal recibido",
            mensaje:
                "Recibimos tu check-in semanal correctamente. Tu médico revisará tu registro y, si lo considera necesario, te enviará indicaciones adicionales.",
        };
    }

    return {
        titulo: "Tu check-in requiere revisión clínica",
        mensaje:
            `Recibimos tu check-in semanal y ${hallazgos.join("; ")}. ` +
            "Nuestro equipo revisará tu evolución y podría enviarte indicaciones por este mismo portal o por correo.",
    };
}

function isTreatmentAdherenceAlert(value) {
    return ["regular", "mala"].includes(normalizeString(value).toLowerCase());
}

function isAppetiteAlert(value) {
    return ["muy reducido", "reducido", "aumentado"].includes(normalizeString(value).toLowerCase());
}

function getCheckinAlertReasons(checkin) {
    const reasons = [];

    if (isTreatmentAdherenceAlert(checkin.adherencia_tratamiento)) {
        reasons.push(`Adherencia al tratamiento: ${checkin.adherencia_tratamiento}`);
    }

    if (isAppetiteAlert(checkin.apetito_semana)) {
        reasons.push(`Apetito esta semana: ${checkin.apetito_semana}`);
    }

    [
        ["Náuseas", checkin.nauseas],
        ["Vómitos", checkin.vomitos],
        ["Diarrea", checkin.diarrea],
        ["Constipación", checkin.constipacion],
        ["Dolor abdominal", checkin.dolor_abdominal],
        ["Hambre nocturna", checkin.hambre_nocturna],
    ].forEach(([label, value]) => {
        if (isSymptomAlert(value)) {
            reasons.push(`${label}: ${value}`);
        }
    });

    return reasons;
}

async function enviarCorreoBrevo({ email, nombreCompleto, asunto, htmlContent, textContent }) {
    const apiKey = process.env.BREVO_API_KEY;
    const empresa = process.env.NOMBRE_EMPRESA || "MetaClinic";
    const remitente = process.env.CORREO_REMITENTE || "contacto@nativecode.cl";

    if (!apiKey) {
        throw new Error("Falta BREVO_API_KEY en .env");
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "api-key": apiKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            sender: {
                name: empresa,
                email: remitente,
            },
            to: [
                {
                    email,
                    name: nombreCompleto,
                },
            ],
            replyTo: {
                email: remitente,
                name: empresa,
            },
            subject: asunto,
            htmlContent,
            textContent,
        }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "No se pudo enviar correo por Brevo.");
    }

    return data;
}

function buildPortalMessageEmail({ nombreCompleto, titulo, mensaje }) {
    const empresa = process.env.NOMBRE_EMPRESA || "MetaClinic";

    return {
        asunto: titulo,
        htmlContent: `
            <div style="margin:0; padding:32px 0; background:#f8fafc; font-family:Arial, Helvetica, sans-serif;">
                <div style="max-width:680px; margin:0 auto; background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; overflow:hidden;">
                    <div style="padding:28px 32px; background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);">
                        <div style="font-size:12px; letter-spacing:0.18em; text-transform:uppercase; color:#93c5fd; font-weight:700; margin-bottom:8px;">
                            Portal del paciente
                        </div>
                        <h1 style="margin:0; color:#ffffff; font-size:24px;">${titulo}</h1>
                    </div>
                    <div style="padding:28px 32px;">
                        <p style="margin:0 0 16px; color:#0f172a; font-size:15px; line-height:1.8;">
                            Hola <strong>${nombreCompleto}</strong>,
                        </p>
                        <p style="margin:0; color:#334155; font-size:15px; line-height:1.8; white-space:pre-line;">
                            ${mensaje}
                        </p>
                    </div>
                    <div style="padding:18px 32px 28px; color:#64748b; font-size:13px; line-height:1.8;">
                        Este mismo mensaje también quedó visible dentro de tu portal clínico en ${empresa}.
                    </div>
                </div>
            </div>
        `,
        textContent:
            `Hola ${nombreCompleto},\n\n` +
            `${mensaje}\n\n` +
            "Este mensaje también quedó disponible dentro de tu portal clínico.",
    };
}

function buildOwnerCheckinAlertEmail({ paciente, telefono, razones, semanaLabel }) {
    const empresa = process.env.NOMBRE_EMPRESA || "MetaClinic";
    const nombreCompleto = `${paciente.nombre || ""} ${paciente.apellido || ""}`.trim() || "Paciente";
    const rut = paciente.rut || "Sin RUT";
    const telefonoPaciente = telefono || paciente.telefono || "Sin teléfono";
    const detalleRazones = Array.isArray(razones) && razones.length > 0
        ? razones.map((razon) => `<li style="margin:0 0 8px;">${razon}</li>`).join("")
        : `<li style="margin:0 0 8px;">Check-in alterado sin detalle adicional.</li>`;
    const detalleRazonesTexto = Array.isArray(razones) && razones.length > 0
        ? razones.map((razon) => `- ${razon}`).join("\n")
        : "- Check-in alterado sin detalle adicional.";

    return {
        asunto: "Alerta de Paciente",
        htmlContent: `
            <div style="margin:0; padding:32px 0; background:#f8fafc; font-family:Arial, Helvetica, sans-serif;">
                <div style="max-width:680px; margin:0 auto; background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; overflow:hidden;">
                    <div style="padding:28px 32px; background:linear-gradient(135deg,#7f1d1d 0%,#b91c1c 100%);">
                        <div style="font-size:12px; letter-spacing:0.18em; text-transform:uppercase; color:#fecaca; font-weight:700; margin-bottom:8px;">
                            Alerta clínica
                        </div>
                        <h1 style="margin:0; color:#ffffff; font-size:24px;">Alerta de Paciente</h1>
                    </div>
                    <div style="padding:28px 32px;">
                        <p style="margin:0 0 16px; color:#0f172a; font-size:15px; line-height:1.8;">
                            El paciente <strong>${nombreCompleto}</strong>, RUT <strong>${rut}</strong>, teléfono <strong>${telefonoPaciente}</strong>, necesita revisión por Check-in alterado.
                        </p>
                        <p style="margin:0 0 16px; color:#334155; font-size:15px; line-height:1.8;">
                            ${semanaLabel ? `Semana informada: <strong>${semanaLabel}</strong>.` : ""}
                        </p>
                        <div style="margin-top:18px; padding:18px 20px; border:1px solid #fecaca; background:#fef2f2; border-radius:14px;">
                            <div style="margin:0 0 10px; color:#991b1b; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.12em;">
                                Campos alterados
                            </div>
                            <ul style="margin:0; padding-left:18px; color:#7f1d1d; font-size:14px; line-height:1.7;">
                                ${detalleRazones}
                            </ul>
                        </div>
                    </div>
                    <div style="padding:18px 32px 28px; color:#64748b; font-size:13px; line-height:1.8;">
                        Correo generado automáticamente por ${empresa}.
                    </div>
                </div>
            </div>
        `,
        textContent:
            `Alerta de Paciente\n\n` +
            `El paciente ${nombreCompleto}, RUT ${rut}, teléfono ${telefonoPaciente}, necesita revisión por Check-in alterado.\n` +
            `${semanaLabel ? `Semana informada: ${semanaLabel}\n` : ""}\n` +
            `Campos alterados:\n${detalleRazonesTexto}`,
    };
}

export default class PortalPacientesController {
    constructor() {
    }

    static async resumenAlertasCheckin(req, res) {
        try {
            const portalPacientes = new PortalPacientes();
            const alertas = await portalPacientes.seleccionarAlertasCheckinPacientes();

            return res.status(200).json(Array.isArray(alertas) ? alertas : []);
        } catch (error) {
            return res.status(500).json({ message: "serverProblem", error: error.message });
        }
    }

    static async resumenPacientePortal(req, res) {
        try {
            const { correo } = req.body;

            if (!correo) {
                return res.status(400).json({ message: "sindato" });
            }

            const portalPacientes = new PortalPacientes();
            const pacienteResultado = await portalPacientes.seleccionarPacientePortalPorCorreo(correo);

            if (!Array.isArray(pacienteResultado) || pacienteResultado.length === 0) {
                return res.status(404).json({ message: false });
            }

            const paciente = pacienteResultado[0];
            const nombreCompleto = `${paciente.nombre || ""} ${paciente.apellido || ""}`.trim() || "Paciente";
            const semanaActual = getCurrentWeekData();

            let checkinResultado = await portalPacientes.seleccionarCheckinSemanalPaciente(
                paciente.id_paciente,
                semanaActual.semana_clave
            );

            if (!Array.isArray(checkinResultado) || checkinResultado.length === 0) {
                await portalPacientes.insertarCheckinSemanalPendiente(
                    paciente.id_paciente,
                    semanaActual.semana_clave,
                    semanaActual.semana_label,
                    semanaActual.fecha_inicio_semana,
                    semanaActual.fecha_fin_semana
                );

                checkinResultado = await portalPacientes.seleccionarCheckinSemanalPaciente(
                    paciente.id_paciente,
                    semanaActual.semana_clave
                );
            }

            const controles = await portalPacientes.seleccionarControlesProximosPaciente(correo);
            const progresoPeso = await portalPacientes.seleccionarProgresoPesoPaciente(paciente.id_paciente);
            const mensajes = await portalPacientes.seleccionarMensajesPaciente(paciente.id_paciente);

            return res.status(200).json({
                paciente: {
                    id_paciente: paciente.id_paciente,
                    nombre: paciente.nombre,
                    apellido: paciente.apellido,
                    correo: paciente.correo,
                },
                controles: Array.isArray(controles) ? controles : [],
                progresoPeso: Array.isArray(progresoPeso) ? progresoPeso : [],
                mensajes: Array.isArray(mensajes) ? mensajes : [],
                checkinActual: Array.isArray(checkinResultado) && checkinResultado.length > 0
                    ? checkinResultado[0]
                    : null,
            });
        } catch (error) {
            return res.status(500).json({ message: "serverProblem", error: error.message });
        }
    }

    static async guardarCheckinSemanal(req, res) {
        try {
            const {
                correo,
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
            } = req.body;

            if (
                !correo ||
                !peso ||
                !cintura ||
                !adherencia_tratamiento ||
                !apetito_semana
            ) {
                return res.status(400).json({ message: "sindato" });
            }

            const portalPacientes = new PortalPacientes();
            const pacienteResultado = await portalPacientes.seleccionarPacientePortalPorCorreo(correo);

            if (!Array.isArray(pacienteResultado) || pacienteResultado.length === 0) {
                return res.status(404).json({ message: false });
            }

            const paciente = pacienteResultado[0];
            const nombreCompleto = `${paciente.nombre || ""} ${paciente.apellido || ""}`.trim() || "Paciente";
            const semanaActual = getCurrentWeekData();

            let checkinResultado = await portalPacientes.seleccionarCheckinSemanalPaciente(
                paciente.id_paciente,
                semanaActual.semana_clave
            );

            if (!Array.isArray(checkinResultado) || checkinResultado.length === 0) {
                await portalPacientes.insertarCheckinSemanalPendiente(
                    paciente.id_paciente,
                    semanaActual.semana_clave,
                    semanaActual.semana_label,
                    semanaActual.fecha_inicio_semana,
                    semanaActual.fecha_fin_semana
                );

                checkinResultado = await portalPacientes.seleccionarCheckinSemanalPaciente(
                    paciente.id_paciente,
                    semanaActual.semana_clave
                );
            }

            const checkinActual = checkinResultado[0];

            const resultadoActualizacion = await portalPacientes.actualizarCheckinSemanalPaciente(
                checkinActual.id_checkin,
                peso,
                cintura,
                presion_arterial || "",
                glicemia_ayuno || "",
                horas_ejercicio || "",
                adherencia_tratamiento,
                apetito_semana,
                nauseas || "",
                vomitos || "",
                diarrea || "",
                constipacion || "",
                dolor_abdominal || "",
                hambre_nocturna || "",
                observaciones_paciente || ""
            );

            if (!resultadoActualizacion || resultadoActualizacion.affectedRows <= 0) {
                return res.status(200).json({ message: false });
            }

            const feedback = buildAutomaticFeedback({
                adherencia_tratamiento,
                apetito_semana,
                nauseas,
                vomitos,
                diarrea,
                constipacion,
                dolor_abdominal,
                hambre_nocturna,
            });
            const checkinAlertReasons = getCheckinAlertReasons({
                adherencia_tratamiento,
                apetito_semana,
                nauseas,
                vomitos,
                diarrea,
                constipacion,
                dolor_abdominal,
                hambre_nocturna,
            });

            await portalPacientes.insertarMensajePaciente(
                paciente.id_paciente,
                "automatico",
                feedback.titulo,
                feedback.mensaje
            );

            let mailSent = true;
            let mailError = null;
            let ownerAlertSent = true;
            let ownerAlertError = null;

            try {
                const contenidoCorreo = buildPortalMessageEmail({
                    nombreCompleto,
                    titulo: feedback.titulo,
                    mensaje: feedback.mensaje,
                });

                await enviarCorreoBrevo({
                    email: paciente.correo,
                    nombreCompleto,
                    asunto: contenidoCorreo.asunto,
                    htmlContent: contenidoCorreo.htmlContent,
                    textContent: contenidoCorreo.textContent,
                });
            } catch (mailException) {
                mailSent = false;
                mailError = mailException.message;
                console.error("[PORTAL PACIENTES] Check-in guardado, pero fallo el envio de correo:", mailException.message);
            }

            if (checkinAlertReasons.length > 0) {
                try {
                    const destinatarioAlerta = process.env.CORREO_RECEPTOR;

                    if (!destinatarioAlerta) {
                        throw new Error("Falta CORREO_RECEPTOR en .env");
                    }

                    const alertaCorreo = buildOwnerCheckinAlertEmail({
                        paciente,
                        telefono: paciente.telefono,
                        razones: checkinAlertReasons,
                        semanaLabel: semanaActual.semana_label,
                    });

                    await enviarCorreoBrevo({
                        email: destinatarioAlerta,
                        nombreCompleto: process.env.NOMBRE_EMPRESA || "Equipo médico",
                        asunto: alertaCorreo.asunto,
                        htmlContent: alertaCorreo.htmlContent,
                        textContent: alertaCorreo.textContent,
                    });
                } catch (ownerMailException) {
                    ownerAlertSent = false;
                    ownerAlertError = ownerMailException.message;
                    console.error("[PORTAL PACIENTES] Check-in alterado, pero fallo el envio de alerta al dueño:", ownerMailException.message);
                }
            }

            return res.status(200).json({
                message: true,
                mailSent,
                mailError,
                ownerAlertSent,
                ownerAlertError,
            });
        } catch (error) {
            return res.status(500).json({ message: "serverProblem", error: error.message });
        }
    }

    static async insertarMensajePaciente(req, res) {
        try {
            const { correo, tipo_mensaje, titulo, mensaje } = req.body;

            if (!correo || !tipo_mensaje || !titulo || !mensaje) {
                return res.status(400).json({ message: "sindato" });
            }

            const portalPacientes = new PortalPacientes();
            const pacienteResultado = await portalPacientes.seleccionarPacientePortalPorCorreo(correo);

            if (!Array.isArray(pacienteResultado) || pacienteResultado.length === 0) {
                return res.status(404).json({ message: false });
            }

            const paciente = pacienteResultado[0];
            const nombreCompleto = `${paciente.nombre || ""} ${paciente.apellido || ""}`.trim() || "Paciente";
            const resultado = await portalPacientes.insertarMensajePaciente(
                paciente.id_paciente,
                tipo_mensaje,
                titulo,
                mensaje
            );

            if (resultado && resultado.affectedRows > 0) {
                let mailSent = true;
                let mailError = null;

                try {
                    const contenidoCorreo = buildPortalMessageEmail({
                        nombreCompleto,
                        titulo,
                        mensaje,
                    });

                    await enviarCorreoBrevo({
                        email: paciente.correo,
                        nombreCompleto,
                        asunto: contenidoCorreo.asunto,
                        htmlContent: contenidoCorreo.htmlContent,
                        textContent: contenidoCorreo.textContent,
                    });
                } catch (mailException) {
                    mailSent = false;
                    mailError = mailException.message;
                    console.error("[PORTAL PACIENTES] Mensaje guardado, pero fallo el envio de correo:", mailException.message);
                }

                return res.status(200).json({
                    message: true,
                    mailSent,
                    mailError,
                });
            }

            return res.status(200).json({ message: false });
        } catch (error) {
            return res.status(500).json({ message: "serverProblem", error: error.message });
        }
    }

    static async enviarRecordatoriosCheckinPendiente(req, res) {
        try {
            const apiKey = req.headers["x-api-key"];

            if (!process.env.TEST_API_KEY || apiKey !== process.env.TEST_API_KEY) {
                return res.status(401).json({ ok: false, error: "No autorizado" });
            }

            const portalPacientes = new PortalPacientes();
            const pendientes = await portalPacientes.seleccionarCheckinsPendientesRecordatorio();
            const enviados = [];
            const errores = [];

            for (const pendiente of pendientes) {
                try {
                    const nombreCompleto = `${pendiente.nombre || ""} ${pendiente.apellido || ""}`.trim() || "Paciente";
                    const asunto = "Recordatorio de check-in semanal pendiente";
                    const htmlContent = `
                        <div style="margin:0; padding:32px 0; background:#f8fafc; font-family:Arial, Helvetica, sans-serif;">
                            <div style="max-width:680px; margin:0 auto; background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; overflow:hidden;">
                                <div style="padding:28px 32px; background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);">
                                    <div style="font-size:12px; letter-spacing:0.18em; text-transform:uppercase; color:#93c5fd; font-weight:700; margin-bottom:8px;">
                                        Seguimiento clínico
                                    </div>
                                    <h1 style="margin:0; color:#ffffff; font-size:24px;">Check-in semanal pendiente</h1>
                                </div>
                                <div style="padding:28px 32px;">
                                    <p style="margin:0 0 16px; color:#0f172a; font-size:15px; line-height:1.8;">
                                        Hola <strong>${nombreCompleto}</strong>,
                                    </p>
                                    <p style="margin:0 0 16px; color:#334155; font-size:15px; line-height:1.8;">
                                        Aún no hemos recibido tu registro semanal correspondiente a <strong>${pendiente.semana_label}</strong>.
                                    </p>
                                    <p style="margin:0; color:#334155; font-size:15px; line-height:1.8;">
                                        Ingresa a tu portal y completa el check-in para que tu médico pueda revisar tus síntomas, evolución y adherencia del tratamiento.
                                    </p>
                                </div>
                            </div>
                        </div>
                    `;
                    const textContent =
                        `Hola ${nombreCompleto},\n\n` +
                        `Aún no recibimos tu registro semanal (${pendiente.semana_label}). ` +
                        "Ingresa a tu portal y completa el check-in para que tu médico revise tu evolución.";

                    await enviarCorreoBrevo({
                        email: pendiente.correo,
                        nombreCompleto,
                        asunto,
                        htmlContent,
                        textContent,
                    });

                    await portalPacientes.marcarRecordatorioCheckin(pendiente.id_checkin);

                    enviados.push({
                        id_checkin: pendiente.id_checkin,
                        correo: pendiente.correo,
                    });
                } catch (error) {
                    errores.push({
                        id_checkin: pendiente.id_checkin,
                        correo: pendiente.correo,
                        error: error.message,
                    });
                }
            }

            return res.status(200).json({
                ok: true,
                enviados,
                errores,
            });
        } catch (error) {
            return res.status(500).json({ ok: false, error: error.message });
        }
    }
}
