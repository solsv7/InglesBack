const bcrypt = require('bcrypt'); 
const express = require('express');
const { check, validationResult } = require('express-validator');
const { User } = require('../models'); 
const router = express.Router();

// registrar un nuevo usuario
router.post(
    '/',
    [
        // Validaciones
        check('dni').isInt().withMessage('El DNI debe ser un número entero.'),
        check('password')
            .isLength({ min: 6 })
            .withMessage('La contraseña debe tener al menos 6 caracteres.'),
        check('role')
            .isIn(['student', 'teacher'])
            .withMessage('El rol debe ser "student" o "teacher".')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { dni, password, role } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10); // Hashea la contraseña antes de guardarla
            const user = await User.create({ dni, password: hashedPassword, role });
            return res.status(201).json({ message: 'Usuario creado', userId: user.id });
        } catch (error) {
            console.error('Error al crear el usuario:', error)
            return res.status(500).json({ error: 'Error al crear el usuario', details: error.message });
        }
    }
);


router.get('/', async (req, res) => {
    try {
        const users = await User.findAll(); 
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar un usuario (PUT)
router.put('/:id', async (req, res) => {
    const { id } = req.params; 
    const { dni, password, role } = req.body; 

    try {
        const user = await User.findByPk(id); // Busca el usuario por ID
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (dni) user.dni = dni;
        if (password) {
            user.password = await bcrypt.hash(password, 10); 
        }
        if (role) user.role = role;

        await user.save(); 

        return res.status(200).json({ message: 'Usuario actualizado', user });
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        return res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
});

// Eliminar un usuario (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await user.destroy();
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
