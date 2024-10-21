const express = require('express');
const router = express.Router();
const { crearUsuario } = require('../controllers/userController');
const sequelize = require('../config/database');

router.post('/', crearUsuario);

router.get('/', async (req, res) => {
    try {
        const [usuarios] = await sequelize.query('CALL obtenerUsuarios()'); 

        console.log('Resultado de la consulta:', usuarios); 

        if (!usuarios || usuarios.length === 0) { 
            return res.status(404).json({ message: 'No se encontraron usuarios' });
        }

        res.status(200).json(usuarios); 
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({
            message: 'Error al obtener los usuarios',
            error: error.message,
        });
    }
});



router.get('/:id', async (req, res) => {
    try {
        const [usuario, metadata] = await sequelize.query('CALL obtenerUsuarioPorId(:id)', {
            replacements: { id: req.params.id }, 
        });
        
        if (usuario.length === 0) { 
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        res.status(200).json(usuario[0]); 
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({
            message: 'Error al obtener el usuario',
            error: error.message,
        });
    }
});

module.exports = router;
