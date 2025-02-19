const sequelize = require('../config/database');

async function enviarMensaje(req, res) {
    const { id_alumno, mensaje, target } = req.body; // Agregamos "target" para saber a quién va dirigido

    try {
        if (!mensaje || mensaje.trim() === "") {
            return res.status(400).json({ error: "El mensaje no puede estar vacío" });
        }

        if (target === "alumno") {
            if (!id_alumno) {
                return res.status(400).json({ error: "El id_alumno es requerido para enviar un mensaje a un alumno" });
            }

            await sequelize.query(
                'CALL SubirMensaje(?, ?)',
                {
                    replacements: [id_alumno, mensaje],
                    type: sequelize.QueryTypes.RAW,
                }
            );

            res.status(200).json({ message: "Mensaje enviado al alumno correctamente" });

        } else if (target === "todos") {
            await sequelize.query(
                'CALL SubirMensajeTodos(?)', // Debes crear este procedimiento almacenado en tu BD
                {
                    replacements: [mensaje],
                    type: sequelize.QueryTypes.RAW,
                }
            );

            res.status(200).json({ message: "Mensaje enviado a todos correctamente" });

        } else {
            return res.status(400).json({ error: "Target inválido. Debe ser 'alumno' o 'todos'" });
        }
    } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        res.status(500).json({ error: "Error al enviar el mensaje" });
    }
}

module.exports = enviarMensaje;


