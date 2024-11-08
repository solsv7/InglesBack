const sequelize = require('../config/database'); 

const obtenerPeriodos = async (req, res) => {
    console.log('Llamando a obtenerPeriodos...'); 
    try {
        const periodos = await sequelize.query('CALL ObtenerPeriodos()');
        res.status(200).json(periodos);
    } catch (error) {
        console.error('Error al obtener los períodos:', error);
        res.status(500).json({ error: 'Error al obtener los períodos' });
    }
};

module.exports = obtenerPeriodos;