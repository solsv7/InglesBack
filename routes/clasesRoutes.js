const express = require('express');
const router = express.Router();
const clasesController = require('../controllers/clasesController');

router.get('/', clasesController.obtenerClases);
router.post('/', clasesController.agregarClase);
router.put('/', clasesController.actualizarClase);
router.post('/eliminar', clasesController.eliminarClase);

module.exports = router;
