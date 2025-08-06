const sequelize = require('../config/database');

async function obtenerInfoPerfil(req, res) {
    const { id_rol, id } = req.query; // Parámetros desde la petición

    console.log('Parámetros recibidos en el backend:', { id_rol, id });

    try {
        const content = await sequelize.query(
            'CALL obtenerInfoPerfil(:id_rol, :id)',
            {
                replacements: { id_rol, id },
                type: sequelize.QueryTypes.RAW,
            }
        );

        res.status(200).json(content);
    } catch (error) {
        console.error('Error al obtener el perfil:', error);
        res.status(500).json({ error: 'Error al obtener el perfil' });
    }
}

async function actualizarPerfil(req, res) {
    try {
        const { id, whatsapp, whatsapp_adulto, mail, id_foto, id_perfil } = req.body;

        console.log('Parámetros para actualizar perfil:', { id, whatsapp, whatsapp_adulto, mail, id_foto, id_perfil });

        const content = await sequelize.query(
            'CALL actualizarPerfil(?, ?, ?, ?, ?)', 
    {
        replacements: [
            id_usuario,
            whatsapp || null,
            whatsapp_adulto || null,
            mail || null,
            id_foto || null
        ],
        type: sequelize.QueryTypes.RAW
    }
        );
            

        res.status(200).json({ message: "Perfil actualizado exitosamente", content });
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        res.status(500).json({ error: 'Error al actualizar el perfil' });
    }
}

module.exports = { obtenerInfoPerfil, actualizarPerfil };
