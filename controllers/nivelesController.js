const sequelize = require('../config/database'); 

const obtenerNiveles = async (req, res) => {
    console.log('Obteniendo categorías...'); 
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
    const { nombre } = req.body;
    try {
        await sequelize.query('CALL AgregarNivel(?)', { replacements: [nombre] });
        res.status(201).json({ message: 'Nivel agregado exitosamente' });
    } catch (error) {
        console.error('Error al agregar nivel:', error);
        res.status(500).json({ error: 'Error al agregar nivel' });
    }
};

const editarNivel = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        await sequelize.query('CALL EditarNivel(?, ?)', { replacements: [id, nombre] });
        res.status(200).json({ message: 'Nivel actualizado correctamente' });
    } catch (error) {
        console.error('Error al editar nivel:', error);
        res.status(500).json({ error: 'Error al editar nivel' });
    }
};

const eliminarNivel = async (req, res) => {
    const { id } = req.params;
    try {
        await sequelize.query('CALL EliminarNivel(?)', { replacements: [id] });
        res.status(200).json({ message: 'Nivel eliminado correctamente (marcado como inactivo)' });
    } catch (error) {
        console.error('Error al eliminar nivel:', error);
        res.status(500).json({ error: 'Error al eliminar nivel' });
    }
};


module.exports = { obtenerNiveles, agregarNivel, editarNivel, eliminarNivel };