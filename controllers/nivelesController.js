const sequelize = require('../config/database'); 

const obtenerNiveles = async (req, res) => {
    console.log('Obteniendo categorías...'); 
    try {
        const niveles = await sequelize.query('CALL ObtenerNiveles()');
        console.log('Niveles obtenidos:', JSON.stringify(niveles, null, 2)); 
        res.status(200).json(niveles); 
    } catch (error) {
        console.error('Error al obtener los niveles:', error);
        res.status(500).json({ error: 'Error al obtener los niveles' });
    }
};

module.exports = obtenerNiveles