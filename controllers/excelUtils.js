const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');
require('dotenv').config();


async function exportToExcel(req, res) {
    const data = req.body; // Los datos enviados desde el formulario
    const formName = data.nombre;

    console.log('Datos recibidos para Excel:', data);
    try {
        // Crear un nuevo libro de trabajo (workbook)
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`${formName}_Form`);

        // Agregar encabezados y datos
        const keys = Object.keys(data);
        worksheet.addRow(keys); // Agregar encabezados
        worksheet.addRow(keys.map(key => data[key])); // Agregar datos

        // Guardar el archivo temporalmente en el servidor
        const filePath = path.join(__dirname, `${formName}_Form.xlsx`);
        await workbook.xlsx.writeFile(filePath);

        // Configurar transporte de nodemailer
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true para 465, false para otros puertos
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });
        
        

        // Configurar el correo
        const mailOptions = {
            from: process.env.EMAIL_USER, // Dirección de origen
            to: 'lautibustamante.lomb@gmail.com', // Dirección del destinatario
            subject: 'Formulario Excel',
            text: 'Adjunto encontrarás el archivo Excel de los formularios enviados.',
            attachments: [
                {
                    filename: `${formName}_Form.xlsx`,
                    path: filePath // Ruta del archivo adjunto
                }
            ]
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);

        // Eliminar el archivo temporal
        fs.unlinkSync(filePath);

        res.status(200).json({ message: 'Archivo enviado por correo electrónico correctamente.' });
    } catch (error) {
        console.error('Error al enviar el archivo por correo:', error);

         // Intentar eliminar el archivo si ocurre un error
         if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        res.status(500).json({ error: 'Error al enviar el archivo por correo electrónico' });
    }
}

module.exports = exportToExcel;
