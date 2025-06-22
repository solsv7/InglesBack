const express = require('express');
const router = express.Router();
const { subirMensajeClase } = require('../controllers/messagesCourseController.js');

// Ruta para enviar mensaje a alumnos de una clase
router.post('/mensajeClase', subirMensajeClase);

module.exports = router;
