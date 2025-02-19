const express = require('express');
const router = express.Router();
const clasesController = require('../controllers/clasesController');

router.get('/', clasesController.obtenerClases);
router.post('/', clasesController.agregarClase);
router.put('/', clasesController.actualizarClase);
router.delete('/:id_clase', clasesController.eliminarClase);

module.exports = router;
