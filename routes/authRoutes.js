const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/login', authController.login);

router.post('/register', async (req, res) => {
    const validation = await authController.validarRegistro(req, res);
    if (validation !== true) return;

    await authController.registerUser(req, res);
});

router.put('/actualizar-contrasenia', async (req, res) => {
    const { dni, nueva_contrasenia } = req.body;

    if (!dni || !nueva_contrasenia) {
        return res.status(400).json({ message: 'DNI y nueva contraseña son obligatorios.' });
    }

    await authController.actualizarContrasenia(req, res);
});

module.exports = router;
