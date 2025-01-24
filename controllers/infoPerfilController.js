const sequelize = require('../config/database');

async function obtenerInfoPerfil(req, res) {
    // Obtener parámetros desde req.query para solicitudes GET
    const id_alumno = req.query.id_alumno || null;
    const id_profesor = req.query.id_profesor || null;

    console.log('Parámetros recibidos en la base de datos:', { id_alumno, id_profesor });

    try {
        const content = await sequelize.query(
            'CALL obtenerInfoPerfil(:id_alumno, :id_profesor)',
            {
                replacements: { id_alumno, id_profesor },
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
        // 📌 Obtener datos correctamente desde req.body
        const { id_alumno, id_profesor, whatsapp, whatsapp_adulto, mail, id_foto, id_perfil } = req.body;

        console.log('Parámetros recibidos en la base de datos para actualizar:', { 
            id_alumno, id_profesor, whatsapp, whatsapp_adulto, mail, id_foto, id_perfil 
        });

        // 📌 Ejecutar procedimiento almacenado con los datos
        const content = await sequelize.query(
            'CALL actualizarPerfil(:id_alumno, :id_profesor, :whatsapp, :whatsapp_adulto, :mail, :id_foto, :id_perfil)',
            {
                replacements: { id_alumno, id_profesor, whatsapp, whatsapp_adulto, mail, id_foto, id_perfil },
                type: sequelize.QueryTypes.RAW,
            }
        );

        res.status(200).json({ message: "Perfil actualizado exitosamente", content });
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        res.status(500).json({ error: 'Error al actualizar el perfil' });
    }
}


module.exports = {obtenerInfoPerfil, actualizarPerfil};
