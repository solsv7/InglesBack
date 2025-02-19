const sequelize = require('../config/database');

// Obtener todos los horarios
const obtenerHorarios = async (req, res) => {
    console.log('Obteniendo horarios...');
    try {
        const horarios = await sequelize.query('CALL ObtenerHorarios()');
        console.log('Horarios obtenidos:', JSON.stringify(horarios, null, 2));
        res.status(200).json(horarios);
    } catch (error) {
        console.error('Error al obtener los horarios:', error);
        res.status(500).json({ error: 'Error al obtener los horarios' });
    }
};

// Agregar un nuevo horario
const agregarHorario = async (req, res) => {
    const { hora_inicio, hora_fin } = req.body;
    console.log('Agregando horario...', req.body);
    try {
        // Insertar el horario sin id_clase ya que ahora se maneja desde la tabla clases
        await sequelize.query('CALL AgregarHorario(:hora_inicio, :hora_fin)', {
            replacements: { hora_inicio, hora_fin }
        });
        res.status(201).json({ message: 'Horario agregado correctamente' });
    } catch (error) {
        console.error('Error al agregar el horario:', error);
        res.status(500).json({ error: 'Error al agregar el horario' });
    }
};

// Actualizar un horario existente
const actualizarHorario = async (req, res) => {
    const { id_horario, hora_inicio, hora_fin } = req.body;
    console.log('Actualizando horario...', req.body);
    try {
        // Ejecutamos la actualización del horario
        await sequelize.query('UPDATE horarios SET hora_inicio = :hora_inicio, hora_fin = :hora_fin WHERE id_horario = :id_horario', {
            replacements: { id_horario, hora_inicio, hora_fin }
        });
        res.status(200).json({ message: 'Horario actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el horario:', error);
        res.status(500).json({ error: 'Error al actualizar el horario' });
    }
};

// Eliminar un horario
const eliminarHorario = async (req, res) => {
    const { id_horario } = req.params;
    console.log('Eliminando horario con ID:', id_horario);
    try {
        await sequelize.query('CALL EliminarHorario(:id_horario)', {
            replacements: { id_horario }
        });
        res.status(200).json({ message: 'Horario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el horario:', error);
        res.status(500).json({ error: 'Error al eliminar el horario' });
    }
};

module.exports = {
    obtenerHorarios,
    agregarHorario,
    actualizarHorario,
    eliminarHorario
};
