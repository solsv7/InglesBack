// routes/cuotasRoutes.js
const express = require('express');
const router = express.Router();
const cuotasController = require('../controllers/cuotasController');

router.post('/', cuotasController.crearCuota);
router.get('/', cuotasController.obtenerCuotas);
router.get('/alumno/:id_alumno', cuotasController.obtenerCuotasPorAlumno);
router.get('/pendientes', cuotasController.obtenerCuotasPendientes);
router.put('/editar/:id_cuota', cuotasController.editarCuota);
router.get('/rango', cuotasController.obtenerCuotasPorRango);
router.delete('/eliminar/:id_cuota', cuotasController.eliminarCuota);
router.get('/anio', cuotasController.obtenerCuotasPorAnio);
router.get('/vigentes', cuotasController.verificarCuotasVigentes);
module.exports = router;
