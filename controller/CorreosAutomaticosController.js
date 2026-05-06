import "dotenv/config";

export default class CorreosAutomaticosController {

    constructor() {

    }


    static async enviarSeguimiento(req, res) {
        try {
            const { asunto, email, mensaje } = req.body;
            console.log(req.body);

            // Validación básica
            if (!asunto || !email || !mensaje) {
                return res.status(400).json({ message: 'sindato' });
            }

            const apiKey = process.env.BREVO_API_KEY;
            const NOMBRE_EMPRESA = process.env.NOMBRE_EMPRESA;
            const CORREO_REMITENTE = process.env.CORREO_REMITENTE || "contacto@nativecode.cl";

            if (!apiKey) {
                console.error("Falta BREVO_API_KEY en .env");
                return res.status(500).json({ mensaje: 'sindato' });
            }

            const mensajeHtml = mensaje
                .split("\n")
                .map((linea) => linea.trim())
                .filter(Boolean)
                .map((linea) => `<p style="margin:0 0 12px; line-height:1.7; color:#334155; font-size:15px;">${linea}</p>`)
                .join("");

            const response = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                    "api-key": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sender: {
                        name: NOMBRE_EMPRESA,
                        email: CORREO_REMITENTE,
                    },
                    to: [
                        {
                            email: email, // email del cliente
                            name: "Cliente",
                        },
                    ],
                    replyTo: {
                        email: CORREO_REMITENTE,
                        name: NOMBRE_EMPRESA,
                    },
                    subject: asunto,
                    htmlContent: `
                        <div style="margin:0; padding:32px 0; background-color:#f8fafc; font-family:Arial, Helvetica, sans-serif;">
                            <div style="max-width:680px; margin:0 auto; background:#ffffff; border:1px solid #e2e8f0; border-radius:18px; overflow:hidden; box-shadow:0 18px 50px rgba(15,23,42,0.08);">
                                <div style="padding:26px 32px; background:linear-gradient(135deg,#0f172a 0%, #1e293b 100%);">
                                    <div style="font-size:12px; letter-spacing:0.22em; text-transform:uppercase; color:#93c5fd; font-weight:700; margin-bottom:10px;">
                                        Comunicación Clínica
                                    </div>
                                    <h1 style="margin:0; color:#ffffff; font-size:24px; line-height:1.25; font-weight:700;">
                                        ${NOMBRE_EMPRESA}
                                    </h1>
                                    <p style="margin:10px 0 0; color:#cbd5e1; font-size:14px; line-height:1.6;">
                                        Información oficial enviada desde nuestro equipo de atención.
                                    </p>
                                </div>

                                <div style="padding:28px 32px 12px;">
                                    <div style="display:inline-block; padding:8px 14px; border-radius:999px; background:#eff6ff; color:#1d4ed8; font-size:12px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;">
                                        ${asunto}
                                    </div>
                                </div>

                                <div style="padding:0 32px 12px;">
                                    <div style="border:1px solid #e2e8f0; border-radius:16px; background:#f8fafc; padding:22px 22px 10px;">
                                        ${mensajeHtml}
                                    </div>
                                </div>

                                <div style="padding:8px 32px 0;">
                                    <div style="height:1px; background:#e2e8f0;"></div>
                                </div>

                                <div style="padding:22px 32px 30px;">
                                    <p style="margin:0 0 10px; color:#0f172a; font-size:14px; font-weight:700;">
                                        Equipo clínico ${NOMBRE_EMPRESA}
                                    </p>
                                    <p style="margin:0; color:#64748b; font-size:13px; line-height:1.7;">
                                        Este correo corresponde a una comunicación formal de atención enviada por nuestros canales institucionales.
                                    </p>
                                </div>

                                <div style="padding:14px 32px; background:#f8fafc; border-top:1px solid #e2e8f0;">
                                    <p style="margin:0; color:#94a3b8; font-size:12px; line-height:1.6;">
                                        ${NOMBRE_EMPRESA} · Mensajería institucional de pacientes
                                    </p>
                                </div>
                            </div>
                        </div>
                    `,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Error Brevo:", data);
                return res.status(500).json({ mensaje: false });
            }

            return res.json({
                message: true,
            });

        } catch (error) {
            console.error("Error servidor:", error);
            return res.status(500).json({ ok: false, error: "Error del servidor al enviar correo" });
        }
    }

    static async enviarAccesoSeguimiento(req, res) {
        try {
            const { email, firstName, lastName, password, accessUrl } = req.body;

            if (!email || !firstName || !lastName || !password || !accessUrl) {
                return res.status(400).json({ message: "sindato" });
            }

            const apiKey = process.env.BREVO_API_KEY;
            const empresa = process.env.NOMBRE_EMPRESA || "MetaClinic";
            const remitente = process.env.CORREO_REMITENTE || "contacto@nativecode.cl";

            if (!apiKey) {
                console.error("[MAIL ACCESO] Falta BREVO_API_KEY en .env");
                return res.status(500).json({ message: false });
            }

            if (!remitente) {
                console.error("[MAIL ACCESO] Falta CORREO_REMITENTE en .env");
                return res.status(500).json({ message: false });
            }

            const nombreCompleto = `${firstName} ${lastName}`.trim();
            const asunto = `Acceso habilitado para seguimiento de tratamiento en ${empresa}`;

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
                    htmlContent: `
                        <div style="margin:0; padding:36px 0; background-color:#f4f7fb; font-family:Arial, Helvetica, sans-serif;">
                            <div style="max-width:720px; margin:0 auto; background:#ffffff; border:1px solid #dbe4ee; border-radius:24px; overflow:hidden; box-shadow:0 20px 60px rgba(15,23,42,0.08);">
                                <div style="padding:30px 36px; background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);">
                                    <div style="font-size:12px; letter-spacing:0.22em; text-transform:uppercase; color:#93c5fd; font-weight:700; margin-bottom:12px;">
                                        Acceso clínico habilitado
                                    </div>
                                    <h1 style="margin:0; color:#ffffff; font-size:28px; line-height:1.2; font-weight:700;">
                                        Seguimiento de tratamiento
                                    </h1>
                                    <p style="margin:12px 0 0; color:#dbeafe; font-size:15px; line-height:1.7;">
                                        Comunicación institucional para pacientes con acceso al módulo de seguimiento en ${empresa}.
                                    </p>
                                </div>

                                <div style="padding:34px 36px 10px;">
                                    <p style="margin:0 0 16px; color:#0f172a; font-size:16px; line-height:1.8;">
                                        Estimado(a) <strong>${nombreCompleto}</strong>:
                                    </p>
                                    <p style="margin:0 0 14px; color:#334155; font-size:15px; line-height:1.8;">
                                        Junto con saludar, a continuación adjuntamos su acceso para que pueda realizar su seguimiento de tratamiento en <strong>${empresa}</strong>.
                                    </p>
                                    <p style="margin:0; color:#334155; font-size:15px; line-height:1.8;">
                                        Este acceso ha sido habilitado exclusivamente para su módulo de seguimiento clínico, donde podrá revisar la información que nuestro equipo disponga para su proceso de atención.
                                    </p>
                                </div>

                                <div style="padding:18px 36px 8px;">
                                    <div style="border:1px solid #d9e2ec; border-radius:20px; background:#f8fafc; overflow:hidden;">
                                        <div style="padding:16px 20px; background:#e8f0fb; border-bottom:1px solid #d9e2ec;">
                                            <div style="font-size:12px; letter-spacing:0.14em; text-transform:uppercase; color:#1d4ed8; font-weight:700;">
                                                Credenciales de acceso
                                            </div>
                                        </div>
                                        <div style="padding:8px 20px 16px;">
                                            <table style="width:100%; border-collapse:collapse;">
                                                <tr>
                                                    <td style="padding:14px 0; border-bottom:1px solid #e2e8f0; color:#475569; font-size:14px; width:38%;"><strong>Usuario</strong></td>
                                                    <td style="padding:14px 0; border-bottom:1px solid #e2e8f0; color:#0f172a; font-size:14px;">${email}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:14px 0; border-bottom:1px solid #e2e8f0; color:#475569; font-size:14px;"><strong>Correo registrado</strong></td>
                                                    <td style="padding:14px 0; border-bottom:1px solid #e2e8f0; color:#0f172a; font-size:14px;">${email}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:14px 0; color:#475569; font-size:14px;"><strong>Contraseña inicial</strong></td>
                                                    <td style="padding:14px 0; color:#0f172a; font-size:14px;">${password}</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div style="padding:22px 36px 0; text-align:center;">
                                    <a href="${accessUrl}" style="display:inline-block; background:linear-gradient(135deg,#0f5fa8 0%,#1d4ed8 100%); color:#ffffff; text-decoration:none; padding:15px 28px; border-radius:999px; font-size:14px; font-weight:700;">
                                        Ingresar al portal clínico
                                    </a>
                                    <p style="margin:14px 0 0; color:#64748b; font-size:13px; line-height:1.7;">
                                        Si el botón no se visualiza correctamente, utilice este enlace:
                                        <br />
                                        <a href="${accessUrl}" style="color:#1d4ed8; text-decoration:none;">${accessUrl}</a>
                                    </p>
                                </div>

                                <div style="padding:24px 36px 0;">
                                    <div style="border-top:1px solid #e2e8f0; padding-top:20px;">
                                        <p style="margin:0 0 12px; color:#0f172a; font-size:14px; font-weight:700;">
                                            Recomendación de seguridad
                                        </p>
                                        <p style="margin:0; color:#64748b; font-size:13px; line-height:1.8;">
                                            Por resguardo de su información clínica, le sugerimos mantener estas credenciales de forma privada y actualizar su contraseña una vez que haya ingresado a la plataforma.
                                        </p>
                                    </div>
                                </div>

                                <div style="padding:24px 36px 34px;">
                                    <p style="margin:0 0 10px; color:#0f172a; font-size:14px; font-weight:700;">
                                        Atentamente,
                                    </p>
                                    <p style="margin:0; color:#334155; font-size:14px; line-height:1.7;">
                                        Equipo clínico ${empresa}
                                    </p>
                                    <p style="margin:6px 0 0; color:#64748b; font-size:13px; line-height:1.7;">
                                        Comunicación institucional emitida por canales oficiales de atención.
                                    </p>
                                </div>

                                <div style="padding:16px 36px; background:#f8fafc; border-top:1px solid #e2e8f0;">
                                    <p style="margin:0; color:#94a3b8; font-size:12px; line-height:1.7;">
                                        ${empresa} · Seguimiento clínico de tratamiento
                                    </p>
                                </div>
                            </div>
                        </div>
                    `,
                    textContent:
                        `Estimado(a) ${nombreCompleto},\n\n` +
                        `Junto con saludar, a continuación adjuntamos su acceso para que pueda realizar su seguimiento de tratamiento en ${empresa}.\n\n` +
                        `Usuario: ${email}\n` +
                        `Correo registrado: ${email}\n` +
                        `Contraseña inicial: ${password}\n` +
                        `Acceso: ${accessUrl}\n\n` +
                        `Por resguardo de su información clínica, le sugerimos mantener estas credenciales de forma privada y actualizar su contraseña una vez que haya ingresado.\n\n` +
                        `Atentamente,\nEquipo clínico ${empresa}`,
                }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                console.error("[MAIL ACCESO] Error Brevo:", data);
                return res.status(500).json({ message: false });
            }

            return res.status(200).json({
                message: true,
                messageId: data?.messageId || data?.messageIds?.[0] || null,
            });
        } catch (error) {
            console.error("[MAIL ACCESO] Error servidor:", error);
            return res.status(500).json({ ok: false, error: "Error del servidor al enviar correo" });
        }
    }







    static async enviarFormularioContacto(req, res) {
        try {
            const { nombre, email, mensaje } = req.body;
            const NOMBRE_EMPRESA = process.env.NOMBRE_EMPRESA;
            console.log(req.body);

            // Validación básica
            if (!nombre || !email || !mensaje) {
                return res.status(400).json({ message: 'sindato' });
            }

            const apiKey = process.env.BREVO_API_KEY;
            if (!apiKey) {
                console.error("Falta BREVO_API_KEY en .env");
                return res.status(500).json({ mensaje: 'sindato' });}

            const response = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                    "api-key": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sender: {
                        name: "E-Commerce ProSuite",
                        email: "contacto@nativecode.cl", // remitente de TU dominio
                    },
                    to: [
                        {
                            email: "contacto@nativecode.cl", // donde recibes tú
                            name: "NativeCode",
                        },
                    ],
                    replyTo: {
                        email,
                        name: nombre,
                    },
                    subject: `Nuevo mensaje de ${nombre}`,
                    htmlContent: `

            <h2>Nueva consulta de Cliente desde E-Commerce Pro (Formulario de Contacto):</h2>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mensaje:</strong><br/>${mensaje}</p>
          `,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Error Brevo:", data);
                return res.status(500).json({ mensaje:false });
            }

            return res.json({
                message: true,});

        } catch (error) {
            console.error("Error servidor:", error);
            return res.status(500).json({ ok: false, error: "Error del servidor al enviar correo" });
        }
    }






    static async enviarComprobanteCompra(req, res) {
        try {
            const { cliente, venta, productos } = req.body;
            console.log("BODY COMPROBANTE:", req.body);
            const NOMBRE_EMPRESA = process.env.NOMBRE_EMPRESA;

            // Validación básica
            if (!cliente || !venta || !Array.isArray(productos) || productos.length === 0) {
                return res.status(400).json({ message: 'sindato' });
            }

            const apiKey = process.env.BREVO_API_KEY;
            if (!apiKey) {
                console.error("Falta BREVO_API_KEY en .env");
                return res.status(500).json({ message: 'sindato' });
            }

            // Armamos tabla HTML con el detalle de la compra
            const filasProductos = productos.map((producto) => {
                const subtotal = Number(producto.cantidad) * Number(producto.precioUnitario || producto.precio);
                return `
                <tr>
                    <td>${producto.nombre}</td>
                    <td style="text-align:center;">${producto.cantidad}</td>
                    <td style="text-align:right;">$${Number(producto.precioUnitario || producto.precio).toLocaleString('es-CL')}</td>
                    <td style="text-align:right;">$${subtotal.toLocaleString('es-CL')}</td>
                </tr>
            `;
            }).join("");

            const totalTexto = Number(venta.total).toLocaleString('es-CL');

            const response = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                    "api-key": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sender: {
                        name: "E-Commerce ProSuite",
                        email: "contacto@nativecode.cl", // remitente de TU dominio
                    },
                    to: [
                        {
                            email: cliente.email,         // cliente que compró
                            name: cliente.nombre,
                        },
                        {
                            email: "contacto@nativecode.cl", // copia para ti
                            name: "NativeCode",
                        },
                    ],
                    replyTo: {
                        email: "contacto@nativecode.cl",
                        name: "Soporte ProSuite",
                    },
                    subject: `Comprobante de compra #${venta.codigo || venta.id || ""}`,
                    htmlContent: `
                    <h2>Gracias por tu compra, ${cliente.nombre}</h2>
                    <p>Este es el comprobante de tu compra realizada en <strong> ${NOMBRE_EMPRESA} </strong>.</p>

                    <h3>Datos de la compra</h3>
                    <p><strong>Código de pedido:</strong> ${venta.codigo || "-"}<br/>
                    <strong>Método de pago:</strong> ${venta.medioPago || "-"}<br/>
                    <strong>Fecha:</strong> ${venta.fecha || new Date().toLocaleString('es-CL')}</p>

                    <h3>Detalle de productos</h3>
                    <table width="100%" border="1" cellspacing="0" cellpadding="8" style="border-collapse:collapse;">
                        <thead>
                            <tr>
                                <th align="left">Producto</th>
                                <th>Cant.</th>
                                <th align="right">Precio</th>
                                <th align="right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filasProductos}
                        </tbody>
                    </table>

                    <h3 style="text-align:right; margin-top:16px;">
                        Total pagado: $${totalTexto} CLP
                    </h3>

                    <p>Ante cualquier duda sobre tu compra, porfavor contacta a nuestros canales de ventas oficiales.</p>
                `,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Error Brevo comprobante:", data);
                return res.status(500).json({ message: false });
            }

            return res.json({ message: true });

        } catch (error) {
            console.error("Error servidor (comprobante):", error);
            return res.status(500).json({ message: false, error: "Error del servidor al enviar comprobante" });
        }
    }
}
