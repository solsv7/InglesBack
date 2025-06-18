const sequelize = require('../config/database');

// Obtener todos los períodos activos
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

// Crear un nuevo período
const crearPeriodo = async (req, res) => {
    const { nombre } = req.body;
    try {
        await sequelize.query('CALL CrearPeriodo(:nombre)', {
            replacements: { nombre }
        });
        res.status(201).json({ mensaje: 'Período creado exitosamente' });
    } catch (error) {
        console.error('Error al crear el período:', error);
        res.status(500).json({ error: 'Error al crear el período' });
    }
};

// Editar período
const editarPeriodo = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        await sequelize.query('CALL EditarPeriodo(:id, :nombre)', {
            replacements: { id, nombre }
        });
        res.status(200).json({ mensaje: 'Período actualizado exitosamente' });
    } catch (error) {
        console.error('Error al editar el período:', error);
        res.status(500).json({ error: 'Error al editar el período' });
    }
};

// Eliminar (baja lógica)
const eliminarPeriodo = async (req, res) => {
    const { id } = req.params;
    try {
        await sequelize.query('CALL EliminarPeriodo(:id)', {
            replacements: { id }
        });
        res.status(200).json({ mensaje: 'Período eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el período:', error);
        res.status(500).json({ error: 'Error al eliminar el período' });
    }
};

module.exports = {
    obtenerPeriodos,
    crearPeriodo,
    editarPeriodo,
    eliminarPeriodo
};
