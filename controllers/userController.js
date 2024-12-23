const sequelize = require('../config/database');

async function crearUsuario(req, res) {
    const { id_profesor, id_alumno, id_rol, password } = req.body;

    // Validar que `id_rol` y `password` estén presentes
    if (typeof id_rol === 'undefined' || typeof password === 'undefined') {
        return res.status(400).json({ message: 'id_rol y password son obligatorios' });
    }

    try {
        // Llamada al procedimiento almacenado para insertar un usuario
        await sequelize.query('CALL crearUsuario(:id_alumno, :id_profesor, :id_rol, :password)', {
            replacements: { id_alumno, id_profesor, id_rol, password },
            type: sequelize.QueryTypes.RAW
        });

        res.status(201).json({ message: 'Usuario creado correctamente' });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
    }
}

module.exports = {
    crearUsuario
};


