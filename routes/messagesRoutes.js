const express = require('express');
const router = express.Router();
const subirMensajeAlumno = require('../controllers/messagesController'); // Importa la función directamente

router.post('/', subirMensajeAlumno); // Asocia la función como manejador del POST

module.exports = router;
