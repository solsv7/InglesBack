const express = require('express');
const router = express.Router();
const subirMensajeCurso = require('../controllers/messagesCourseController'); // Importa la función directamente

router.post('/', subirMensajeCurso); // Asocia la función como manejador del POST

module.exports = router;
