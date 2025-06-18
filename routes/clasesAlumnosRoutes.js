const express = require('express');
const router = express.Router();
const {
  obtenerInscripciones,
  inscribirAlumnoClase,
  actualizarInscripcion,
  eliminarInscripcion, 
  obtenerAlumnosPorClase
} = require('../controllers/clasesAlumnosController.js');

router.get('/', obtenerInscripciones);
router.post('/', inscribirAlumnoClase);
router.put('/', actualizarInscripcion);
router.delete('/', eliminarInscripcion);
router.get('/por-clase/:id_clase', obtenerAlumnosPorClase);


module.exports = router;
