const express = require('express');
const router = express.Router();
const { registrarAsistencias,obtenerAsistenciasPorClaseYFecha,obtenerTotalesAsistenciasPorClase,obtenerTotalesPorClaseYRango } = require('../controllers/asistenciasController.js');

router.post('/registrar', registrarAsistencias);
router.get('/por-clase-fecha', obtenerAsistenciasPorClaseYFecha);
router.get('/totales/:id_clase', obtenerTotalesAsistenciasPorClase);
router.get('/totales-rango', obtenerTotalesPorClaseYRango);
module.exports = router;
