const express = require('express');
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/login', authController.login);

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

        const { dni, password, role, userType } = req.body;

        try {
            const [existingUsers] = await pool.query('CALL obtenerUsuarioPorDNI(?)', [dni]);
            if (existingUsers.length > 0) {
                return res.status(400).json({ message: 'Usuario ya existe.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.query('CALL registrarUsuario(?, ?, ?, ?)', [dni, hashedPassword, role, userType]);

            return res.status(201).json({ message: 'Usuario creado' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al crear el usuario' });
        }
    }
);

router.put(
    '/actualizar-contrasenia',
    [
        body('id_usuario').isInt().withMessage('El ID de usuario debe ser un número entero.'),
        body('nueva_contrasenia').isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres.')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            await authController.actualizarContrasenia(req, res);
        } catch (error) {
            console.error('Error al actualizar la contraseña:', error);
            res.status(500).json({ message: 'Error al actualizar la contraseña' });
        }
    }
);


module.exports = router;
