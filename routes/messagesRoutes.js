const express = require('express');
const router = express.Router();
const enviarMensaje = require('../controllers/messagesController'); // Importa la nueva función

router.post('/', enviarMensaje); // Asigna la función corregida

module.exports = router;
