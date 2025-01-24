const express = require('express');
const router = express.Router();
const obtenerVideos = require('../controllers/obtVidsController'); // Importa la función directamente

router.get('/', obtenerVideos); // Asocia la función como manejador del POST

module.exports = router;
