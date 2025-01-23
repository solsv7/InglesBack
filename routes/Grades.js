const express = require('express');
const router = express.Router();
const gradesController = require('../controllers/gradesController');


router.post('/subir', gradesController.subirNota);
router.get('/:idAlumno/:cicloLectivo', gradesController.obtenerNotas);
router.put('/actualizar-nota', gradesController.actualizarNota);

module.exports = router;
