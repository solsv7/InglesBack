// routes/planesRoutes.js
const express = require('express');
const router = express.Router();
const planesController = require('../controllers/planesController.js');

router.post('/', planesController.crearPlan);
router.put('/:id_plan', planesController.editarPlan);
router.get('/', planesController.obtenerPlanes);
router.delete('/:id_plan', planesController.eliminarPlan);

module.exports = router;
