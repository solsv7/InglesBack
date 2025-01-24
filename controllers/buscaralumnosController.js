const sequelize = require('../config/database'); 

const BuscarAlumnos = async (req, res) => {
    const option = req.query.option || null;
    console.log('Obteniendo alumnos...'); 
    try {
        const estudiantes = await sequelize.query('CALL sp_obtener_estudiantes(?)',{
            replacements: [
                option
            ],
            type: sequelize.QueryTypes.RAW,
        }
        );
        console.log('Alumnos obtenidas:', JSON.stringify(estudiantes, null, 2)); 
        res.status(200).json(estudiantes); 
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).json({ error: 'Error al obtener las categorías' });
    }
};




module.exports = BuscarAlumnos;
