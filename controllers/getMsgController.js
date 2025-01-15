const sequelize = require('../config/database');

async function obtenerMensajes(req, res) {
    // Obtener parámetros desde req.query para solicitudes GET
    const { id_alumno } = req.query;

    console.log('Parámetros recibidos en la base de datos:', { id_alumno});

    try {
        const mensajes = await sequelize.query(
            'CALL obtenerMensajes(?)',
            {
                replacements: [id_alumno ],
                type: sequelize.QueryTypes.RAW,
            }
        );

        res.status(200).json(mensajes);
    } catch (error) {
        console.error('Error al obtener los mensajes:', error);
        res.status(500).json({ error: 'Error al obtener los mensajes' });
    }
}


module.exports = obtenerMensajes;
