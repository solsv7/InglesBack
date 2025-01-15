const sequelize = require('../config/database');

async function subirMensajeCurso(req, res) {
    const { id_nivel, mensaje } = req.body;

    try {
        await sequelize.query(
            'CALL SubirMensajeCurso(?, ?)',
            {
                replacements: [id_nivel, mensaje],
                type: sequelize.QueryTypes.RAW,
            }
        );

        res.status(200).json({ message: 'Mensaje enviado correctamente' });
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).json({ error: 'Error al enviar el mensaje' });
    }
}
module.exports = subirMensajeCurso;