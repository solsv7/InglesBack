const sequelize = require('../config/database'); 

const obtenerCategorias = async (req, res) => {
    console.log('Obteniendo categorías...'); 
    try {
        const categorias = await sequelize.query('CALL ObtenerCategorias()');
        console.log('Categorías obtenidas:', JSON.stringify(categorias, null, 2)); 
        res.status(200).json(categorias); 
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).json({ error: 'Error al obtener las categorías' });
    }
};

module.exports = obtenerCategorias