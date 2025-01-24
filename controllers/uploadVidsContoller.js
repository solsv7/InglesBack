const sequelize = require('../config/database');

async function subirVideo(req, res) {
    const { 
        titulo,idioma,url
    } = req.body;
    
    console.log('Datos recibidos:', req.body); // Log para verificar los datos recibidos

    try {
        await sequelize.query(
            'CALL subirVideo(?,?,?)',
            {
                replacements: [
                    titulo,idioma,url
                ],
                type: sequelize.QueryTypes.RAW,
            }
        );
        console.log("Datos enviados al procedimiento:", {
            titulo,idioma,url
        });
        

        res.status(200).json({ message: 'Se subio el video' });
    } catch (error) {
        console.error('Error al subir el video:', error); // Log detallado del error
        res.status(500).json({ error: 'Error al subir el video', details: error.message });
    }
}

module.exports = subirVideo;
