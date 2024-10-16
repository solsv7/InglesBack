const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { User } = require('../models'); 
const jwt = require('jsonwebtoken');
const { Student } = require('../models');


const router = express.Router();

// Middleware para validar el token JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    console.log(token)
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};



// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
    const { dni, password } = req.body;

    try {
        const user = await User.findOne({ where: { dni } });

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const student = await Student.findOne({ where: { userId: user.id } });

        const token = jwt.sign({ id: user.id, dni: user.dni, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        return res.status(200).json({
            token,
            studentId: student ? student.id : null, 
            studentName: student ? student.name : null, 
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});





// Ruta de registro
router.post(
    '/register',
    [
        body('dni').isInt().withMessage('El DNI debe ser un número entero.'),
        body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
        body('role').isIn(['student', 'teacher']).withMessage('El rol debe ser "student" o "teacher".'),
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

// Ruta para obtener todos los usuarios (requiere autenticación)

router.get('/users', authenticateToken, async (req, res) => {
    try {
        const users = await User.findAll(); 
        res.json(users); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

