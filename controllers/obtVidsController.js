const sequelize = require('../config/database'); 

const obtenerVideos = async (req, res) => {
    console.log('Obteniendo videos...'); 
    try {
        const response = await sequelize.query('CALL obtenerVideos()');
        res.status(200).json(response); 
    } catch (error) {
        console.error('Error al obtener los videos:', error);
        res.status(500).json({ error: 'Error al obtener los videos'});
    }
};

module.exports = obtenerVideos;