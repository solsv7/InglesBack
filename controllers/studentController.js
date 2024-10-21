
const sequelize = require('../config/database'); 
const Student = require('../models/Student'); 


async function crearEstudiante(req, res) {
    const { dni_alumno, nombre, id_clase } = req.body;

    
    if (!dni_alumno || !nombre) {
        return res.status(400).json({ message: 'DNI y nombre son obligatorios' });
    }

    try {
        await sequelize.query('CALL crearEstudiante(:dni_alumno, :nombre, :id_clase)', {
            replacements: { dni_alumno, nombre, id_clase },
            type: sequelize.QueryTypes.RAW 
        });

        res.status(201).json({ message: 'Estudiante creado correctamente' });
    } catch (error) {
        console.error('Error al crear el estudiante:', error);
        res.status(500).json({ message: 'Error al crear el estudiante', error: error.message });
    }
}

module.exports = {
    crearEstudiante
};
