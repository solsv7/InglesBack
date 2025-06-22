const express = require('express');
const router = express.Router();
const { registrarAsistencias,obtenerAsistenciasPorClaseYFecha,obtenerTotalesAsistenciasPorClase,obtenerTotalesPorClaseYRango,obtenerAsistenciasPorFechaAlumno,
  obtenerAsistenciasPorRangoAlumno,
  obtenerResumenAsistenciasAlumno } = require('../controllers/asistenciasController.js');

router.post('/registrar', registrarAsistencias);
router.get('/por-clase-fecha', obtenerAsistenciasPorClaseYFecha);
router.get('/totales/:id_clase', obtenerTotalesAsistenciasPorClase);
router.get('/totales-rango', obtenerTotalesPorClaseYRango);

//alumnos
router.get('/resumen/:id_alumno', obtenerResumenAsistenciasAlumno);

router.get('/rango', obtenerAsistenciasPorRangoAlumno);

router.get('/fecha', obtenerAsistenciasPorFechaAlumno);
module.exports = router;
