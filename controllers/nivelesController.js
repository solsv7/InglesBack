const sequelize = require('../config/database');

const obtenerNiveles = async (req, res) => {
    console.log('Obteniendo niveles...');
    try {
        const niveles = await sequelize.query('CALL ObtenerNiveles()');
        console.log('Niveles obtenidos:', JSON.stringify(niveles, null, 2));
        res.status(200).json(niveles);
    } catch (error) {
        console.error('Error al obtener los niveles:', error);
        res.status(500).json({ error: 'Error al obtener los niveles' });
    }
};

const agregarNivel = async (req, res) => {
    const { nombre, idioma } = req.body;

    if (!nombre || !idioma) {
        return res.status(400).json({ error: 'Nombre e idioma son obligatorios' });
    }

    try {
        await sequelize.query('CALL AgregarNivel(:nombre, :idioma)', {
            replacements: { nombre, idioma }
        });
        res.status(201).json({ message: 'Nivel agregado exitosamente' });
    } catch (error) {
        console.error('Error al agregar nivel:', error);
        res.status(500).json({ error: 'Error al agregar nivel' });
    }
};

const editarNivel = async (req, res) => {
    const { id_nivel } = req.params;
    const { nombre, idioma } = req.body;

    if (!nombre || !idioma) {
        return res.status(400).json({ error: 'Nombre e idioma son obligatorios' });
    }

    try {
        await sequelize.query('CALL EditarNivel(:id_nivel, :nombre, :idioma)', {
            replacements: { id_nivel, nombre, idioma }
        });
        res.status(200).json({ message: 'Nivel actualizado correctamente' });
    } catch (error) {
        console.error('Error al editar nivel:', error);
        res.status(500).json({ error: 'Error al editar nivel' });
    }
};

const eliminarNivel = async (req, res) => {
    const { id_nivel } = req.body;

    if (!id_nivel) {
        return res.status(400).json({ error: 'Falta el id_nivel' });
    }

    try {
        await sequelize.query('CALL EliminarNivel(:id_nivel)', {
            replacements: { id_nivel }
        });
        res.status(200).json({ message: 'Nivel eliminado correctamente (marcado como inactivo)' });
    } catch (error) {
        console.error('Error al eliminar nivel:', error);
        res.status(500).json({ error: 'Error al eliminar nivel' });
    }
};



module.exports = {
    obtenerNiveles,
    agregarNivel,
    editarNivel,
    eliminarNivel
};
