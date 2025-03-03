const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuración del transporte de Nodemailer (reutilizable)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function exportToExcel(req, res) {
    const data = req.body; 
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
        return res.status(400).json({ error: "Datos inválidos para generar el Excel" });
    }

    const formName = data.nombre || 'Formulario';

    console.log('Datos recibidos para Excel:', data);

    const filePath = path.join(__dirname, `${formName}_Form.xlsx`);

    try {
        // Crear el archivo Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`${formName}_Form`);
        const keys = Object.keys(data);
        worksheet.addRow(keys);
        worksheet.addRow(keys.map(key => data[key]));

        await workbook.xlsx.writeFile(filePath);

        // Configurar y enviar el correo
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'lautibustamante.lomb@gmail.com',
            subject: 'Formulario Excel',
            text: 'Adjunto encontrarás el archivo Excel de los formularios enviados.',
            attachments: [{ filename: `${formName}_Form.xlsx`, path: filePath }]
        };

        await transporter.sendMail(mailOptions);

        // Eliminar el archivo de forma asíncrona
        await fs.promises.unlink(filePath);

        res.status(200).json({ message: 'Archivo enviado por correo electrónico correctamente.' });
    } catch (error) {
        console.error('Error al enviar el archivo por correo:', error);

        // Intentar eliminar el archivo si existe
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
        }

        res.status(500).json({ error: `Error al enviar el archivo por correo: ${error.message}` });
    }
}

async function enviarCorreoDecision(req, res) {
    const { opcion, email } = req.body;

    if (!email || !opcion) {
        return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }

    let asunto, mensajeHTML;

    if (opcion === "aceptar") {
        asunto = "🎉 ¡Felicidades! Has sido aceptado";
        mensajeHTML = `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #ddd;">
                <h2 style="color: #4CAF50;">🎉 ¡Bienvenido al Campus!</h2>
                <p>Nos alegra informarte que has sido <strong>aceptado</strong> en nuestra comunidad.</p>
                <p>Puedes acceder a nuestra plataforma con tus credenciales.</p>
                <p>Si tienes dudas, contáctanos.</p>
                <p>Att. St.Thomas</p>
            </div>
        `;
    } else {
        asunto = "📢 Información sobre tu solicitud";
        mensajeHTML = `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #ddd;">
                <h2 style="color: #FF0000;">Lamentamos informarte</h2>
                <p>Después de revisar tu solicitud, hemos decidido no aceptarte en esta ocasión.</p>
                <p>Esperamos verte en futuras oportunidades.</p>
                <p>Gracias por tu interés en nuestro campus.</p>
                <p>Att. St.Thomas</p>
            </div>
        `;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email, 
        subject: asunto,
        html: mensajeHTML, 
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Correo enviado correctamente." });
    } catch (error) {
        console.error("Error enviando el correo:", error);
        res.status(500).json({ error: `Error al enviar el correo: ${error.message}` });
    }
}

module.exports = { exportToExcel, enviarCorreoDecision };
