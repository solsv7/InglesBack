const sequelize = require('../config/database');

// Obtener todas las clases
const obtenerClases = async (req, res) => {
    console.log('Obteniendo clases...');
    try {
        // Llamamos al procedimiento almacenado que ya filtra las clases disponibles
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
    console.log('Agregando nueva clase...', req.body);
    
    if (!id_nivel || !id_dia || !hora_inicio || !hora_fin) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const [resultado] = await sequelize.query(
            'CALL insertar_clase(:id_nivel, :id_dia, :hora_inicio, :hora_fin)',
            {
                replacements: { id_nivel, id_dia, hora_inicio, hora_fin }
            }
        );
        console.log('Clase agregada:', resultado);
        res.status(201).json({ message: 'Clase agregada correctamente', resultado });
    } catch (error) {
        console.error('Error al agregar la clase:', error);
        res.status(500).json({ error: 'Error al agregar la clase' });
    }
};

// Actualizar una clase existente
const actualizarClase = async (req, res) => {
    const { id_clase, id_dia, id_nivel, id_horario } = req.body;
    console.log('Actualizando clase...', req.body);
    try {
        await sequelize.query('CALL ActualizarClase(:id_clase, :id_dia, :id_nivel, :id_horario)', {
            replacements: { id_clase, id_dia, id_nivel, id_horario }
        });
        res.status(200).json({ message: 'Clase actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar la clase:', error);
        res.status(500).json({ error: 'Error al actualizar la clase' });
    }
};


// Eliminar una clase
const eliminarClase = async (req, res) => {
    const { id_clase } = req.body;

    if (!id_clase) {
        return res.status(400).json({ error: 'El ID de la clase es obligatorio' });
    }

    try {
        await sequelize.query('CALL EliminarClase(:id_clase)', {
            replacements: { id_clase }
        });
        res.status(200).json({ message: 'Clase eliminada correctamente (marcada como no disponible)' });
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
