const sequelize = require('../config/database');

// Obtener todas las clases
const obtenerClases = async (req, res) => {
    console.log('Obteniendo clases...');
    try {
        const clases = await sequelize.query('CALL ObtenerClases()');
        console.log('Clases obtenidas:', JSON.stringify(clases, null, 2));
        res.status(200).json(clases);
    } catch (error) {
        console.error('Error al obtener las clases:', error);
        res.status(500).json({ error: 'Error al obtener las clases' });
    }
};

// Agregar una nueva clase
const agregarClase = async (req, res) => {
    const { id_nivel, id_dia, hora_inicio, hora_fin } = req.body;
    console.log('Agregando clase...', req.body);
    try {
        // Ejecutamos el procedimiento para agregar una clase con los nuevos cambios
        await sequelize.query('CALL agregar_clase(:id_nivel, :id_dia, :hora_inicio, :hora_fin)', {
            replacements: { id_nivel, id_dia, hora_inicio, hora_fin }
        });
        res.status(201).json({ message: 'Clase agregada correctamente' });
    } catch (error) {
        console.error('Error al agregar la clase:', error);
        res.status(500).json({ error: 'Error al agregar la clase' });
    }
};

// Actualizar una clase existente
const actualizarClase = async (req, res) => {
    const { id_clase, id_nivel, id_dia, id_horario } = req.body;
    console.log('Actualizando clase...', req.body);
    try {
        // Actualizar el id_horario de la clase
        await sequelize.query('UPDATE clases SET id_horario = :id_horario, id_nivel = :id_nivel, id_dia = :id_dia WHERE id_clase = :id_clase', {
            replacements: { id_clase, id_nivel, id_dia, id_horario }
        });
        res.status(200).json({ message: 'Clase actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar la clase:', error);
        res.status(500).json({ error: 'Error al actualizar la clase' });
    }
};

// Eliminar una clase
const eliminarClase = async (req, res) => {
    const { id_clase } = req.params;
    console.log('Eliminando clase con ID:', id_clase);
    try {
        await sequelize.query('CALL EliminarClase(:id_clase)', {
            replacements: { id_clase }
        });
        res.status(200).json({ message: 'Clase eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar la clase:', error);
        res.status(500).json({ error: 'Error al eliminar la clase' });
    }
};

module.exports = {
    obtenerClases,
    agregarClase,
    actualizarClase,
    eliminarClase
};
