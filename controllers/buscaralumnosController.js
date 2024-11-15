const sequelize = require('../config/database'); 

const BuscarAlumnos = async (req, res) => {
    console.log('Obteniendo alumnos...'); 
    try {
        const estudiantes = await sequelize.query('CALL sp_obtener_estudiantes()');
        console.log('Allumnos obtenidas:', JSON.stringify(estudiantes, null, 2)); 
        res.status(200).json(estudiantes); 
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).json({ error: 'Error al obtener las categorías' });
    }
};




module.exports = BuscarAlumnos;
