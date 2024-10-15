const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const {User} = require('../models'); 
const jwt = require('jsonwebtoken');

const router = express.Router();

// ...

router.post('/login', async (req, res) => {
    const { dni, password } = req.body;

    try {
        const user = await User.findOne({ where: { dni } });
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar un token
        const token = jwt.sign({ id: user.id, role: user.role }, 'tu_secreto', { expiresIn: '1h' });
        return res.status(200).json({ message: 'Inicio de sesión exitoso', token, role: user.role });
    } catch (error) {
        console.error('Error en inicio de sesión:', error);
        return res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});


router.post(
    '/register',
    [
        body('dni').isInt().withMessage('El DNI debe ser un número entero.'),
        body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
        body('role').isIn(['student', 'admin/teacher']).withMessage('El rol debe ser "student" o "teacher".'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

    const { dni, password, role } = req.body;

    try {
    const existingUser = await User.findOne({ where: { dni } });
    if (existingUser) {
        return res.status(400).json({ message: 'Usuario ya existe.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        dni,
        password: hashedPassword,
        role,
    });

    return res.status(201).json({ message: 'Usuario creado', userId: newUser.id });
    } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear el usuario' });
    }
}
);
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll(); 
        res.json(users); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;


router.post(
    '/register',
    [
        body('dni').isInt().withMessage('El DNI debe ser un número entero.'),
        body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
        body('role').isIn(['student', 'admin/teacher']).withMessage('El rol debe ser "student" o "teacher".'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

    const { dni, password, role } = req.body;

    try {
      //si el usuario ya existe
    const existingUser = await User.findOne({ where: { dni } });
    if (existingUser) {
        return res.status(400).json({ message: 'Usuario ya existe.' });
    }

      // encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

      // nuevo usuario
    const newUser = await User.create({
        dni,
        password: hashedPassword,
        role,
    });

    return res.status(201).json({ message: 'Usuario creado', userId: newUser.id });
    } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear el usuario' });
    }
}
);
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll(); 
        res.json(users); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
