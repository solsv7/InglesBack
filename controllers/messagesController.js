const sequelize = require('../config/database'); 

async function subirMensajeAlumno(req, res) {
    const { id_alumno, mensaje } = req.body;

    try {
        await sequelize.query(
            'CALL SubirMensaje(?, ?)',
            {
                replacements: [id_alumno, mensaje],
                type: sequelize.QueryTypes.RAW,
            }
        );

        res.status(200).json({ message: 'Mensaje enviado correctamente' });
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).json({ error: 'Error al enviar el mensaje' });
    }
}

module.exports = subirMensajeAlumno; 


