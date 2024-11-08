const express = require('express');
const router = express.Router();
const gradesController = require('../controllers/gradesController');


router.post('/subir', gradesController.subirNota);
router.get('/:idAlumno', gradesController.obtenerNotas);

module.exports = router;
