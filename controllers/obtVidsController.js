const sequelize = require('../config/database'); 

const obtenerVideos = async (req, res) => {
    console.log('Obteniendo videos...'); 
    try {
        const response = await sequelize.query('CALL obtenerVideos()');
        res.status(200).json(response); 
    }} catch (error) {
    console.error('Error al obtener los videos:');

    if (error.original) {
        console.error('Código del error SQL:', error.original.code);
        console.error('Mensaje SQL:', error.original.sqlMessage);
        console.error('SQL ejecutado:', error.original.sql);
    } else {
        console.error(error);
    }

    res.status(500).json({
        error: 'Error al obtener los videos',
        detalle: error.original?.sqlMessage || error.message
    });
}

};

module.exports = obtenerVideos;
